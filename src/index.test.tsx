import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import ReactRevolver, { arrowOverhangModes } from './index';

function Item({ label }: { label: string }) {
    return <div>{label}</div>;
}

const bullets = [
    <Item key="a" label="a" />,
    <Item key="b" label="b" />,
    <Item key="c" label="c" />,
    <Item key="d" label="d" />,
    <Item key="e" label="e" />,
];

describe('ReactRevolver', () => {
    it('renders all bullets, the arrow buttons, and one footer ball per bullet', () => {
        render(<ReactRevolver numberOfColumns={3} bullets={bullets} />);

        expect(screen.getAllByText('a').length).toBe(3); // 3 copies
        expect(screen.getByText('previous')).toBeInTheDocument();
        expect(screen.getByText('next')).toBeInTheDocument();
        expect(screen.getAllByRole('button', { name: /^[0-4]$/ })).toHaveLength(bullets.length);
    });

    it('exposes goToIndex/next/previous via ref and moves the selected footer ball', () => {
        const ref = createRef<ReactRevolver>();
        render(<ReactRevolver ref={ref} numberOfColumns={3} bullets={bullets} />);

        expect(ref.current).not.toBeNull();
        expect(screen.getByText('0').closest('li')).toHaveClass('react-revolver__ball--selected');

        act(() => ref.current!.next());
        expect(screen.getByText('1').closest('li')).toHaveClass('react-revolver__ball--selected');

        act(() => ref.current!.previous());
        expect(screen.getByText('0').closest('li')).toHaveClass('react-revolver__ball--selected');

        act(() => ref.current!.goToIndex(3));
        expect(screen.getByText('3').closest('li')).toHaveClass('react-revolver__ball--selected');
    });

    it('moves to a clicked footer ball and applies overhang mode classes to the arrow buttons', () => {
        render(<ReactRevolver numberOfColumns={3} bullets={bullets} arrowOverhangMode={arrowOverhangModes.none} />);

        fireEvent.click(screen.getByText('2').closest('li')!);
        expect(screen.getByText('2').closest('li')).toHaveClass('react-revolver__ball--selected');

        expect(screen.getByText('previous').closest('button')).toHaveClass('react-revolver__button--overhang-none');
        expect(screen.getByText('next').closest('button')).toHaveClass('react-revolver__button--overhang-none');
    });

    it('picks up bullet content changes after mount without remounting', () => {
        const { rerender } = render(<ReactRevolver numberOfColumns={3} bullets={bullets} />);

        const updatedBullets = [
            <Item key="a" label="a-updated" />,
            ...bullets.slice(1),
        ];
        rerender(<ReactRevolver numberOfColumns={3} bullets={updatedBullets} />);

        expect(screen.getAllByText('a-updated').length).toBe(3);
        expect(screen.queryByText('a')).not.toBeInTheDocument();
    });

    it('recomputes geometry and clamps currentIndex when bullets shrink after mount', () => {
        const ref = createRef<ReactRevolver>();
        const { rerender } = render(<ReactRevolver ref={ref} numberOfColumns={3} bullets={bullets} />);

        act(() => ref.current!.goToIndex(4));
        expect(screen.getByText('4').closest('li')).toHaveClass('react-revolver__ball--selected');

        const shorterBullets = bullets.slice(0, 3);
        rerender(<ReactRevolver ref={ref} numberOfColumns={3} bullets={shorterBullets} />);

        expect(screen.getAllByRole('button', { name: /^[0-2]$/ })).toHaveLength(3);
        expect(screen.getByText('2').closest('li')).toHaveClass('react-revolver__ball--selected'); // clamped, not reset to 0
    });

    it('recomputes itemWidth when numberOfColumns changes after mount', () => {
        const { rerender, container } = render(<ReactRevolver numberOfColumns={3} bullets={bullets} />);
        rerender(<ReactRevolver numberOfColumns={2} bullets={bullets} />);

        const content = container.querySelectorAll('.react-revolver__content')[0] as HTMLElement;
        expect(content.style.width).toBe('50%');
    });

    it('hides arrow buttons when hideArrows is true', () => {
        render(<ReactRevolver numberOfColumns={3} bullets={bullets} hideArrows />);

        expect(screen.queryByText('previous')).not.toBeInTheDocument();
        expect(screen.queryByText('next')).not.toBeInTheDocument();
    });

    it('hides footer balls when hideBalls is true', () => {
        render(<ReactRevolver numberOfColumns={3} bullets={bullets} hideBalls />);

        expect(screen.queryAllByRole('button', { name: /^[0-4]$/ })).toHaveLength(0);
    });

    it('still allows programmatic navigation via ref when arrows and balls are hidden', () => {
        const ref = createRef<ReactRevolver>();
        render(<ReactRevolver ref={ref} numberOfColumns={3} bullets={bullets} hideArrows hideBalls />);

        expect(() => act(() => ref.current!.goToIndex(2))).not.toThrow();
    });

    it('starts on the given startingIndex', () => {
        render(<ReactRevolver numberOfColumns={3} bullets={bullets} startingIndex={2} />);

        expect(screen.getByText('2').closest('li')).toHaveClass('react-revolver__ball--selected');
    });

    it('clamps and warns when startingIndex is out of range', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        render(<ReactRevolver numberOfColumns={3} bullets={bullets} startingIndex={99} />);

        expect(screen.getByText('4').closest('li')).toHaveClass('react-revolver__ball--selected'); // clamped to last index
        expect(warnSpy).toHaveBeenCalled();

        warnSpy.mockRestore();
    });

    it('defaults to index 0 when startingIndex is omitted', () => {
        render(<ReactRevolver numberOfColumns={3} bullets={bullets} />);

        expect(screen.getByText('0').closest('li')).toHaveClass('react-revolver__ball--selected');
    });
});
