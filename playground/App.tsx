import { createRef, useState } from 'react';
import ReactRevolver, { arrowOverhangModes, ArrowOverhangMode } from '../src/index';
import './App.css';

interface RevolverItemProps {
    title: string;
    text: string;
    image: string;
}

function RevolverItem({ title, text, image }: RevolverItemProps) {
    return (
        <div className="revolverItem">
            <img alt={title} src={image} />
            <div className="body">
                <div className="title">{title}</div>
                <div className="text">{text}</div>
            </div>
            <div className="footer">Footer</div>
        </div>
    );
}

const allItems: RevolverItemProps[] = [
    {
        title: 'Title 1',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec facilisis erat sit amet lorem malesuada feugiat. Nunc malesuada porta orci, a finibus urna sagittis in.',
        image: 'https://dummyimage.com/600x400/999/fff.jpg',
    },
    {
        title: 'Title 2',
        text: 'Fusce posuere convallis fringilla. Donec malesuada nibh ut odio venenatis, a fermentum mauris tempus. Nulla at ante justo.',
        image: 'https://dummyimage.com/300x200/999/fff.jpg',
    },
    {
        title: 'Title 3',
        text: 'Proin hendrerit mi felis, in vestibulum turpis eleifend in.',
        image: 'https://dummyimage.com/400x400/999/fff.jpg',
    },
    {
        title: 'Title 4',
        text: 'Suspendisse a dolor sed lectus aliquet pellentesque. Aliquam erat volutpat. Quisque in tempor dui.',
        image: 'https://dummyimage.com/600x400/999/fff.jpg',
    },
    {
        title: 'Title 5',
        text: 'Praesent laoreet eros lectus, ac laoreet ligula lacinia vel. Praesent tempor euismod enim non malesuada. Integer tincidunt consequat scelerisque.',
        image: 'https://dummyimage.com/600x400/999/fff.jpg',
    },
    {
        title: 'Title 6',
        text: 'Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo.',
        image: 'https://dummyimage.com/500x300/999/fff.jpg',
    },
    {
        title: 'Title 7',
        text: 'Cras mattis consectetur purus sit amet fermentum. Vestibulum id ligula porta felis euismod semper.',
        image: 'https://dummyimage.com/600x400/999/fff.jpg',
    },
];

function App() {
    const revolverRef = createRef<ReactRevolver>();

    const [overhangMode, setOverhangMode] = useState<ArrowOverhangMode>(arrowOverhangModes.some);
    const [itemCount, setItemCount] = useState(5);
    const [numberOfColumns, setNumberOfColumns] = useState(3);
    const [hideArrows, setHideArrows] = useState(false);
    const [hideBalls, setHideBalls] = useState(false);
    const [startingIndex, setStartingIndex] = useState(0);
    const [remountKey, setRemountKey] = useState(0);

    const items = allItems.slice(0, itemCount);

    return (
        <div className="App">
            <ReactRevolver
                key={remountKey}
                ref={revolverRef}
                numberOfColumns={numberOfColumns}
                arrowOverhangMode={overhangMode}
                hideArrows={hideArrows}
                hideBalls={hideBalls}
                startingIndex={startingIndex}
                bullets={items.map((item) => (
                    <RevolverItem key={item.title} {...item} />
                ))}
            />

            <div style={{ marginTop: '50px', marginBottom: '20px' }}>Control the Revolver from our App</div>

            <div className="controls">
                <button style={{ marginRight: '40px' }} onClick={() => revolverRef.current?.previous()}>
                    Previous
                </button>
                <button style={{ marginRight: '40px' }} onClick={() => revolverRef.current?.next()}>
                    Next
                </button>
                <span style={{ marginRight: '8px' }}>Go to index</span>
                <select
                    value="none"
                    onChange={(e) => revolverRef.current?.goToIndex(parseInt(e.target.value, 10))}
                >
                    <option value="none" />
                    {items.map((_, index) => (
                        <option key={index} value={index}>{index}</option>
                    ))}
                </select>
            </div>

            <div className="controls">
                <label>
                    arrowOverhangMode:{' '}
                    <select value={overhangMode} onChange={(e) => setOverhangMode(e.target.value as ArrowOverhangMode)}>
                        {Object.values(arrowOverhangModes).map((mode) => (
                            <option key={mode} value={mode}>{mode}</option>
                        ))}
                    </select>
                </label>

                <button onClick={() => setItemCount((n) => Math.min(n + 1, allItems.length))}>add bullet</button>
                <button onClick={() => setItemCount((n) => Math.max(n - 1, 1))}>remove bullet</button>
                <label>
                    numberOfColumns:{' '}
                    <select value={numberOfColumns} onChange={(e) => setNumberOfColumns(Number(e.target.value))}>
                        {[1, 2, 3, 4].map((n) => (
                            <option key={n} value={n}>{n}</option>
                        ))}
                    </select>
                </label>
            </div>

            <div className="controls">
                <label>
                    <input type="checkbox" checked={hideArrows} onChange={(e) => setHideArrows(e.target.checked)} />
                    {' '}hideArrows
                </label>
                <label>
                    <input type="checkbox" checked={hideBalls} onChange={(e) => setHideBalls(e.target.checked)} />
                    {' '}hideBalls
                </label>
            </div>

            <div className="controls">
                {/* startingIndex only takes effect at mount, so this control forces a remount rather than updating live */}
                <label>
                    startingIndex:{' '}
                    <input
                        type="number"
                        min={0}
                        value={startingIndex}
                        onChange={(e) => setStartingIndex(Number(e.target.value))}
                        style={{ width: '4rem' }}
                    />
                </label>
                <button onClick={() => setRemountKey((k) => k + 1)}>remount with startingIndex</button>
            </div>
        </div>
    );
}

export default App;
