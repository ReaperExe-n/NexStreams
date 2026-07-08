const DISTANCE = 0;
const IN = { scale: 1, opacity: 1 };
const OUT = { scale: 0, opacity: 0 };

const TRANSITION_ENTER = {
  duration: 0.4,
  ease: [0.25, 1, 0.5, 1],
};

const TRANSITION_EXIT = {
  duration: 0.3,
  ease: [0.25, 1, 0.5, 1],
};

export const varZoomIn = {
  initial: OUT,
  animate: { ...IN, transition: TRANSITION_ENTER },
  exit: { ...OUT, transition: TRANSITION_EXIT },
};

export const varZoomInLeft = {
  initial: { ...OUT, translateX: -DISTANCE },
  animate: { ...IN, translateX: 0, transition: TRANSITION_ENTER },
  exit: { ...OUT, translateX: -DISTANCE, transition: TRANSITION_EXIT },
};

export const varZoomInRight = {
  initial: { ...OUT, translateX: DISTANCE },
  animate: { ...IN, translateX: 0, transition: TRANSITION_ENTER },
  exit: { ...OUT, translateX: DISTANCE, transition: TRANSITION_EXIT },
};
