import gsap from 'gsap';

/**
 * Các đường cong gia tốc (Easing) chuẩn phong cách thời trang cao cấp Dịp Xinh
 */
export const MOTION_EASING = {
  luxury: 'power2.out',
  smooth: 'power3.inOut',
  bounce: 'back.out(1.4)',
  linear: 'none',
} as const;

/**
 * Các mốc thời lượng (Duration) chuẩn giây
 */
export const MOTION_DURATION = {
  instant: 0.15,
  fast: 0.25,
  normal: 0.4,
  editorial: 0.6,
  slow: 0.8,
} as const;

/**
 * Kiểm tra xem người dùng có kích hoạt chế độ Giảm Chuyển Động (prefers-reduced-motion) hay không
 */
export const isReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Thực thi hoạt họa an toàn, tự động bỏ qua nếu người dùng bật giảm chuyển động
 */
export const safeAnimate = (callback: () => void, fallback?: () => void): void => {
  if (isReducedMotion()) {
    if (fallback) fallback();
    return;
  }
  callback();
};

/**
 * Tạo tween dải chạy vô tận (Infinite Marquee) chuẩn 60 FPS
 * Tự động gắn thuộc tính GPU acceleration và lắng nghe visibilitychange
 */
export const createInfiniteMarquee = (
  target: string | Element | Element[],
  options: {
    speed?: number; // thời gian chạy hết 1 chu kỳ (mặc định 25s)
    reverse?: boolean;
    pauseOnHover?: boolean;
  } = {}
) => {
  const { speed = 25, reverse = false } = options;

  if (isReducedMotion()) {
    return null;
  }

  const tween = gsap.to(target, {
    xPercent: reverse ? 50 : -50,
    ease: MOTION_EASING.linear,
    duration: speed,
    repeat: -1,
  });

  // Tạm dừng khi tab bị ẩn để tiết kiệm pin và RAM
  const handleVisibility = () => {
    if (document.hidden) {
      tween.pause();
    } else {
      tween.resume();
    }
  };

  document.addEventListener('visibilitychange', handleVisibility);

  return {
    tween,
    destroy: () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      tween.kill();
    },
  };
};
