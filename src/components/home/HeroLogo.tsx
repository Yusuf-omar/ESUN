"use client";

import Image from "next/image";
import { motion } from "framer-motion";

/**
 * الشعار الرئيسي – ESUN (رمز + نص)
 * الصورة في public/logo.png – تظهر كاملة بدون قص
 */
const LOGO_CONFIG = {
  logoSrc: "/logo.png",
  /** أبعاد كافية لإظهار الشعار كاملاً (الرمز + ESUN) بدون قص */
  imageWidth: 220,
  imageHeight: 188,
};

export function HeroLogo() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="relative mx-auto flex w-full max-w-[min(240px,78vw)] items-center justify-center overflow-visible"
    >
      <div className="relative w-full flex items-center justify-center">
        <Image
          src={LOGO_CONFIG.logoSrc}
          alt="ESUN - اتحاد الطلاب المصريين"
          width={LOGO_CONFIG.imageWidth}
          height={LOGO_CONFIG.imageHeight}
          className="h-auto w-full max-h-[210px] object-contain object-center"
          priority
          sizes="(max-width: 768px) 78vw, 240px"
        />
      </div>
    </motion.div>
  );
}
