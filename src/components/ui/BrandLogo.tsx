import { motion } from "framer-motion";
import Link from "next/link";

export default function BrandLogo() {
  return (
    // <div>
    //   <h3 className="font-semibold text-lg">veriprops</h3>
    //   <p className=" text-sm -mt-1.5 text-muted-foreground">verified properties</p>
    // </div>
    <>
            <Link href="/" className="inline-block">
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">V</span>
              </div>
              <div>
                <span className="text-xl font-bold text-foreground">veriprops</span>
                <p className=" text-sm -mt-1.5 text-muted-foreground">verified properties</p>
              </div>
            </motion.div>
          </Link>
    </>
  );
}
