import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h1 className="font-poppins font-bold text-4xl md:text-5xl lg:text-6xl leading-tight text-foreground">
              Next-gen <span className="text-accent-cyan">cloud storage</span> with AI intelligence
            </h1>
            <p className="text-lg text-muted-foreground max-w-md">
              Store, manage, and secure your files with our futuristic platform enhanced by powerful AI capabilities.
            </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-3">
              <Link href="/auth">
                <Button 
                  className="ripple hover-glow bg-accent-blue text-white font-medium py-3 px-6 rounded-2xl transition-all flex items-center justify-center"
                >
                  <span>Get Started</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Button>
              </Link>
              <Button 
                variant="outline"
                className="ripple border border-accent-grey/30 text-foreground font-medium py-3 px-6 rounded-2xl transition-all hover:bg-primary-800/50 flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5 text-accent-cyan" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polygon points="10 8 16 12 10 16 10 8"/>
                </svg>
                <span>See how it works</span>
              </Button>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-accent-blue/10 rounded-full blur-3xl"></div>
            <div className="relative bg-primary-800/80 backdrop-blur-sm p-6 rounded-2xl border border-muted/50">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-poppins font-semibold text-foreground">My Storage</h3>
                <div className="flex space-x-2">
                  <button className="text-muted-foreground hover:text-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"/>
                      <path d="m21 21-4.3-4.3"/>
                    </svg>
                  </button>
                  <button className="text-muted-foreground hover:text-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
                      <path d="M12 12v9"/>
                      <path d="m16 16-4-4-4 4"/>
                    </svg>
                  </button>
                  <button className="text-muted-foreground hover:text-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="1"/>
                      <circle cx="12" cy="5" r="1"/>
                      <circle cx="12" cy="19" r="1"/>
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Storage Status */}
              <div className="mb-6 bg-primary-900/60 p-4 rounded-xl">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Storage Used</span>
                  <span className="text-sm font-medium text-foreground">5.3 GB / 10 GB</span>
                </div>
                <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "53%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-accent-blue to-accent-cyan"
                  ></motion.div>
                </div>
              </div>
              
              {/* File Categories */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                  className="card-lift bg-primary-900/60 p-3 rounded-xl flex items-center space-x-3"
                >
                  <div className="bg-accent-blue/20 p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="text-accent-cyan h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                      <circle cx="9" cy="9" r="2"/>
                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-foreground text-sm font-medium">Images</p>
                    <p className="text-muted-foreground text-xs">2.1 GB</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.7 }}
                  className="card-lift bg-primary-900/60 p-3 rounded-xl flex items-center space-x-3"
                >
                  <div className="bg-accent-blue/20 p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="text-accent-cyan h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-foreground text-sm font-medium">Documents</p>
                    <p className="text-muted-foreground text-xs">1.8 GB</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.8 }}
                  className="card-lift bg-primary-900/60 p-3 rounded-xl flex items-center space-x-3"
                >
                  <div className="bg-accent-blue/20 p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="text-accent-cyan h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m22 8-6 4 6 4V8Z"/>
                      <rect x="2" y="6" width="14" height="12" rx="2" ry="2"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-foreground text-sm font-medium">Videos</p>
                    <p className="text-muted-foreground text-xs">0.9 GB</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.9 }}
                  className="card-lift bg-primary-900/60 p-3 rounded-xl flex items-center space-x-3"
                >
                  <div className="bg-accent-blue/20 p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="text-accent-cyan h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18V5l12-2v13"/>
                      <circle cx="6" cy="18" r="3"/>
                      <circle cx="18" cy="16" r="3"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-foreground text-sm font-medium">Audio</p>
                    <p className="text-muted-foreground text-xs">0.5 GB</p>
                  </div>
                </motion.div>
              </div>
              
              {/* Recent Files */}
              <h4 className="font-poppins font-medium text-foreground mb-3">Recent Files</h4>
              <div className="space-y-3">
                <motion.div 
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1 }}
                  className="bg-primary-900/60 p-3 rounded-xl flex justify-between items-center"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-secondary p-2 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="text-accent-cyan h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-foreground text-sm font-medium">Project Presentation.pptx</p>
                      <p className="text-muted-foreground text-xs">15.2 MB • 2 hours ago</p>
                    </div>
                  </div>
                  <button className="text-muted-foreground hover:text-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" x2="12" y1="15" y2="3"/>
                    </svg>
                  </button>
                </motion.div>
                
                <motion.div 
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.1 }}
                  className="bg-primary-900/60 p-3 rounded-xl flex justify-between items-center"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-secondary p-2 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="text-accent-cyan h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                        <circle cx="9" cy="9" r="2"/>
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-foreground text-sm font-medium">Product Demo.jpg</p>
                      <p className="text-muted-foreground text-xs">3.8 MB • 5 hours ago</p>
                    </div>
                  </div>
                  <button className="text-muted-foreground hover:text-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" x2="12" y1="15" y2="3"/>
                    </svg>
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
