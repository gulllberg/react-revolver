import React from 'react';
import './index.css';

export const arrowOverhangModes = {
    none: "none",
    some: "some",
    all: "all" // default
};

const transition = "transform .5s ease";

export default class ReactRevolver extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentGroup: 'middle',
            currentIndex: 0,
            numberOfBullets: props.bullets.length,
            numberOfColumns: Math.min(props.numberOfColumns, props.bullets.length),
            itemWidth: 100 / Math.min(props.numberOfColumns, props.bullets.length), // percent
            middleBullets: props.bullets.map(b => ({bullet: b, translateX: -(props.bullets.length) * 100, transition})),
            leftBullets: props.bullets.map(b => ({bullet: b, translateX: -(props.bullets.length) * 100, transition})),
            rightBullets: props.bullets.map(b => ({bullet: b, translateX: -(props.bullets.length) * 100, transition}))
        };
        this.goToIndex = this.goToIndex.bind(this);
        this.previous = this.previous.bind(this);
        this.next = this.next.bind(this);
    }

    render() {
        let thisComponent = this;
        let state = thisComponent.state;

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
                                {bullet.bullet}
                            </div>
                        );
                    })}
                </div>
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
                <ol className="react-revolver__footer">
                    {state.middleBullets.map(function (bullet, index) {
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
            </div>
        );
    }

    goToIndex(index) {
        this.setState(function (state) {
            let change = index - state.currentIndex;

            return {
                currentIndex: index,
                leftBullets: state.leftBullets.map(b => ({...b, translateX: b.translateX - change * 100, transition})),
                middleBullets: state.middleBullets.map(b => ({...b, translateX: b.translateX - change * 100, transition})),
                rightBullets: state.rightBullets.map(b => ({...b, translateX: b.translateX - change * 100, transition})),
            };
        });
    }

    previous() {
        let thisComponent = this;

        if (thisComponent.state.currentIndex !== 0) {
            thisComponent.goToIndex(thisComponent.state.currentIndex - 1);
        } else {
            // Revolve left
            thisComponent.setState(function (state) {
                let nextGroup = {
                    middle: 'left',
                    left: 'right',
                    right: 'middle',
                }[state.currentGroup];
                let leftTranslateX = {
                    left: -(state.numberOfBullets - 1) * 100,
                    middle: -(2 * state.numberOfBullets - 1) * 100,
                    right: 1 * 100,
                }[nextGroup];
                let leftTransition = {
                    middle: 'none',
                    right: transition,
                    left: transition,
                }[nextGroup];
                let middleTranslateX = {
                    left: -(state.numberOfBullets - 1) * 100,
                    middle: -(2 * state.numberOfBullets - 1) * 100,
                    right: -(3 * state.numberOfBullets - 1) * 100,
                }[nextGroup];
                let middleTransition = {
                    middle: transition,
                    right: 'none',
                    left: transition,
                }[nextGroup];
                let rightTranslateX = {
                    left: -(4 * state.numberOfBullets - 1) * 100,
                    middle: -(2 * state.numberOfBullets - 1) * 100,
                    right: -(3 * state.numberOfBullets - 1) * 100,
                }[nextGroup];
                let rightTransition = {
                    middle: transition,
                    right: transition,
                    left: 'none',
                }[nextGroup];
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
        let thisComponent = this;

        if (thisComponent.state.currentIndex + 1 < thisComponent.state.numberOfBullets) {
            thisComponent.goToIndex(thisComponent.state.currentIndex + 1);
        } else {
            // Revolve right
            thisComponent.setState(function (state) {
                let nextGroup = {
                    middle: 'right',
                    left: 'middle',
                    right: 'left',
                }[state.currentGroup];
                let leftTranslateX = {
                    left: 0,
                    middle: -(state.numberOfBullets) * 100,
                    right: state.numberOfBullets * 100,
                }[nextGroup];
                let leftTransition = {
                    middle: transition,
                    right: 'none',
                    left: transition,
                }[nextGroup];
                let middleTranslateX = {
                    left: 0,
                    middle: -(state.numberOfBullets) * 100,
                    right: -(2 * state.numberOfBullets) * 100,
                }[nextGroup];
                let middleTransition = {
                    middle: transition,
                    right: transition,
                    left: 'none',
                }[nextGroup];
                let rightTranslateX = {
                    left: -(3 * state.numberOfBullets) * 100,
                    middle: -(state.numberOfBullets) * 100,
                    right: -(2 * state.numberOfBullets) * 100,
                }[nextGroup];
                let rightTransition = {
                    middle: 'none',
                    right: transition,
                    left: transition,
                }[nextGroup];
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
