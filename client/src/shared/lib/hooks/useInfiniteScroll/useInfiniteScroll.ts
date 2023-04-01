import { MutableRefObject, useEffect } from 'react';

interface UseInfiniteScrollOptions {
    callback?: () => void;
    wrapperRef: MutableRefObject<HTMLElement>;
    triggerRef: MutableRefObject<HTMLElement>;
}

export const useInfiniteScroll = ({ callback, wrapperRef, triggerRef }: UseInfiniteScrollOptions) => {
    useEffect(() => {
        let observer: IntersectionObserver | null = null;
        const wrapperElement = wrapperRef.current;
        const triggerElement = triggerRef.current;

        if (callback) {
            const options = {
                root: wrapperElement,
                rootMargin: '0px',
                treshold: 1.0,
            };

            observer = new IntersectionObserver(([entry]) => {
                if (entry.isIntersecting) {
                    callback();
                }
            }, options);

            observer.observe(triggerElement);
        }

        return () => {
            if (observer && triggerElement) {
                observer?.unobserve(triggerElement);
            }
        };
    }, [callback, wrapperRef, triggerRef]);
};
