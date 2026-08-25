import React from 'react';
import './index.css';

export const arrowOverhangModes = {
    none: "none",
    some: "some",
    all: "all" // default
} as const;

export type ArrowOverhangMode = typeof arrowOverhangModes[keyof typeof arrowOverhangModes];

export interface ReactRevolverProps {
    bullets: React.ReactElement[];
    numberOfColumns: number;
    arrowOverhangMode?: ArrowOverhangMode;
    hideArrows?: boolean;
    hideBalls?: boolean;
    startingIndex?: number;
}

type Group = 'left' | 'middle' | 'right';

interface BulletState {
    translateX: number;
    transition: string;
}

interface ReactRevolverState {
    currentGroup: Group;
    currentIndex: number;
    numberOfBullets: number;
    numberOfColumns: number;
    itemWidth: number;
    leftBullets: BulletState[];
    middleBullets: BulletState[];
    rightBullets: BulletState[];
}

const transition = "transform .5s ease";

// Which group takes over the "middle" role when revolving. Only depends on the
// current group, so these rotation tables are the same on every call.
const revolveLeftNextGroup: Record<Group, Group> = {middle: 'left', left: 'right', right: 'middle'};
const revolveRightNextGroup: Record<Group, Group> = {middle: 'right', left: 'middle', right: 'left'};

// Transition to apply to each group once revolveLeft/RightNextGroup has picked the
// new group. Unlike the translateX tables (which also depend on numberOfBullets and
// so stay inline), these only depend on nextGroup, so they're static too.
const revolveLeftLeftTransition: Record<Group, string> = {middle: 'none', right: transition, left: transition};
const revolveLeftMiddleTransition: Record<Group, string> = {middle: transition, right: 'none', left: transition};
const revolveLeftRightTransition: Record<Group, string> = {middle: transition, right: transition, left: 'none'};

const revolveRightLeftTransition: Record<Group, string> = {middle: transition, right: 'none', left: transition};
const revolveRightMiddleTransition: Record<Group, string> = {middle: transition, right: transition, left: 'none'};
const revolveRightRightTransition: Record<Group, string> = {middle: 'none', right: transition, left: transition};

export default class ReactRevolver extends React.Component<ReactRevolverProps, ReactRevolverState> {
    // Computes the full geometry (bullet count/columns/width and the three groups'
    // translateX/transition baselines) from scratch for a given props+index. Used by
    // both the constructor (initial mount) and componentDidUpdate (structural prop
    // changes), so bullets/numberOfColumns changes and startingIndex share one formula.
    private static computeGeometry(props: ReactRevolverProps, currentIndex: number, transitionValue: string): ReactRevolverState {
        const numberOfBullets = props.bullets.length;
        const numberOfColumns = Math.min(props.numberOfColumns, numberOfBullets);
        const itemWidth = 100 / numberOfColumns; // percent
        const clampedIndex = Math.min(Math.max(currentIndex, 0), numberOfBullets - 1);
        const translateX = -(numberOfBullets + clampedIndex) * 100;
        const makeGroup = () => Array.from({length: numberOfBullets}, () => ({translateX, transition: transitionValue}));

        return {
            currentGroup: 'middle',
            currentIndex: clampedIndex,
            numberOfBullets,
            numberOfColumns,
            itemWidth,
            leftBullets: makeGroup(),
            middleBullets: makeGroup(),
            rightBullets: makeGroup(),
        };
    }

    constructor(props: ReactRevolverProps) {
        super(props);

        const requestedIndex = props.startingIndex ?? 0;
        const maxIndex = props.bullets.length - 1;
        const clampedIndex = Math.min(Math.max(requestedIndex, 0), maxIndex);
        if (requestedIndex !== clampedIndex) {
            console.warn(`react-revolver: startingIndex ${requestedIndex} is out of range [0, ${maxIndex}]; using ${clampedIndex} instead.`);
        }

        this.state = ReactRevolver.computeGeometry(props, clampedIndex, transition);
        this.goToIndex = this.goToIndex.bind(this);
        this.previous = this.previous.bind(this);
        this.next = this.next.bind(this);
    }

    componentDidUpdate(prevProps: ReactRevolverProps) {
        const structuralChange = prevProps.bullets.length !== this.props.bullets.length
            || prevProps.numberOfColumns !== this.props.numberOfColumns;

        if (structuralChange) {
            this.setState(state => ReactRevolver.computeGeometry(this.props, state.currentIndex, 'none'));
        }
    }

    render() {
        const thisComponent = this;
        const state = thisComponent.state;

        return (
            <div className="react-revolver">
                <div className="react-revolver__content-container">
                    {state.leftBullets.concat(state.middleBullets, state.rightBullets).map(function (bullet, index) {
                        return (
                            <div
                                key={index}
                                className="react-revolver__content"
                                style={{width: `${state.itemWidth}%`, transform: `translateX(${bullet.translateX}%)`, transition: bullet.transition}}
                            >
                                {thisComponent.props.bullets[index % state.numberOfBullets]}
                            </div>
                        );
                    })}
                </div>
                {!thisComponent.props.hideArrows && (
                    <>
                        <button
                            className={`react-revolver__prev-button${thisComponent.props.arrowOverhangMode === arrowOverhangModes.some ? ' react-revolver__button--overhang-some' : ''}${thisComponent.props.arrowOverhangMode === arrowOverhangModes.none ? ' react-revolver__button--overhang-none' : ''}`}
                            type="button"
                            onClick={thisComponent.previous}>
                            <span>previous</span>
                        </button>
                        <button
                            className={`react-revolver__next-button${thisComponent.props.arrowOverhangMode === arrowOverhangModes.some ? ' react-revolver__button--overhang-some' : ''}${thisComponent.props.arrowOverhangMode === arrowOverhangModes.none ? ' react-revolver__button--overhang-none' : ''}`}
                            type="button"
                            onClick={thisComponent.next}>
                            <span>next</span>
                        </button>
                    </>
                )}
                {!thisComponent.props.hideBalls && (
                    <ol className="react-revolver__footer">
                        {state.middleBullets.map(function (_bullet, index) {
                            return (
                                <li
                                    key={index}
                                    className={`react-revolver__ball${thisComponent.state.currentIndex === index ? ' react-revolver__ball--selected' : ''}`}
                                    role="button"
                                    onClick={function () {
                                        thisComponent.goToIndex(index);
                                    }}>
                                    {index}
                                </li>
                            );
                        })}
                    </ol>
                )}
            </div>
        );
    }

    goToIndex(index: number) {
        this.setState(function (state) {
            const change = index - state.currentIndex;

            return {
                currentIndex: index,
                leftBullets: state.leftBullets.map(b => ({...b, translateX: b.translateX - change * 100, transition})),
                middleBullets: state.middleBullets.map(b => ({...b, translateX: b.translateX - change * 100, transition})),
                rightBullets: state.rightBullets.map(b => ({...b, translateX: b.translateX - change * 100, transition})),
            };
        });
    }

    previous() {
        const thisComponent = this;

        if (thisComponent.state.currentIndex !== 0) {
            thisComponent.goToIndex(thisComponent.state.currentIndex - 1);
        } else {
            // Revolve left
            thisComponent.setState(function (state) {
                const nextGroup = revolveLeftNextGroup[state.currentGroup];
                const leftTranslateX = {
                    left: -(state.numberOfBullets - 1) * 100,
                    middle: -(2 * state.numberOfBullets - 1) * 100,
                    right: 1 * 100,
                }[nextGroup];
                const leftTransition = revolveLeftLeftTransition[nextGroup];
                const middleTranslateX = {
                    left: -(state.numberOfBullets - 1) * 100,
                    middle: -(2 * state.numberOfBullets - 1) * 100,
                    right: -(3 * state.numberOfBullets - 1) * 100,
                }[nextGroup];
                const middleTransition = revolveLeftMiddleTransition[nextGroup];
                const rightTranslateX = {
                    left: -(4 * state.numberOfBullets - 1) * 100,
                    middle: -(2 * state.numberOfBullets - 1) * 100,
                    right: -(3 * state.numberOfBullets - 1) * 100,
                }[nextGroup];
                const rightTransition = revolveLeftRightTransition[nextGroup];
                return {
                    currentIndex: state.numberOfBullets - 1,
                    currentGroup: nextGroup,
                    leftBullets: state.leftBullets.map(b => ({...b, translateX: leftTranslateX, transition: leftTransition})),
                    middleBullets: state.middleBullets.map(b => ({...b, translateX: middleTranslateX, transition: middleTransition})),
                    rightBullets: state.rightBullets.map(b => ({...b, translateX: rightTranslateX, transition: rightTransition})),
                };
            });
        }
    }

    next() {
        const thisComponent = this;

        if (thisComponent.state.currentIndex + 1 < thisComponent.state.numberOfBullets) {
            thisComponent.goToIndex(thisComponent.state.currentIndex + 1);
        } else {
            // Revolve right
            thisComponent.setState(function (state) {
                const nextGroup = revolveRightNextGroup[state.currentGroup];
                const leftTranslateX = {
                    left: 0,
                    middle: -(state.numberOfBullets) * 100,
                    right: state.numberOfBullets * 100,
                }[nextGroup];
                const leftTransition = revolveRightLeftTransition[nextGroup];
                const middleTranslateX = {
                    left: 0,
                    middle: -(state.numberOfBullets) * 100,
                    right: -(2 * state.numberOfBullets) * 100,
                }[nextGroup];
                const middleTransition = revolveRightMiddleTransition[nextGroup];
                const rightTranslateX = {
                    left: -(3 * state.numberOfBullets) * 100,
                    middle: -(state.numberOfBullets) * 100,
                    right: -(2 * state.numberOfBullets) * 100,
                }[nextGroup];
                const rightTransition = revolveRightRightTransition[nextGroup];
                return {
                    currentIndex: 0,
                    currentGroup: nextGroup,
                    leftBullets: state.leftBullets.map(b => ({...b, translateX: leftTranslateX, transition: leftTransition})),
                    middleBullets: state.middleBullets.map(b => ({...b, translateX: middleTranslateX, transition: middleTransition})),
                    rightBullets: state.rightBullets.map(b => ({...b, translateX: rightTranslateX, transition: rightTransition})),
                };
            });
        }
    }
}
