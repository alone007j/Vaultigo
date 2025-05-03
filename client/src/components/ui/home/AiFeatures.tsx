import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function AiFeatures() {
  const [isTyping, setIsTyping] = useState(true);
  
  // Simulate AI typing completion after 3 seconds
  setTimeout(() => {
    setIsTyping(false);
  }, 3000);

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-5xl">
        <div className="w-full h-full bg-accent-blue/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="font-poppins font-bold text-3xl md:text-4xl text-foreground mb-6">
              AI-powered <span className="text-accent-cyan">intelligence</span> enhances your storage
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Choose from leading AI models to organize, search, and analyze your files with unprecedented efficiency.
            </p>

            <div className="space-y-5">
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                viewport={{ once: true }}
                className="flex items-start space-x-4"
              >
                <div className="bg-accent-blue/20 p-2 rounded-lg shrink-0 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-accent-cyan h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-poppins font-medium text-foreground text-lg mb-1">Smart File Search</h3>
                  <p className="text-muted-foreground">
                    Ask AI to find files using natural language – search by content, context, or description.
                  </p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                viewport={{ once: true }}
                className="flex items-start space-x-4"
              >
                <div className="bg-accent-blue/20 p-2 rounded-lg shrink-0 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-accent-cyan h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                    <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" />
                    <path d="M9 17h6" />
                    <path d="M9 13h6" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-poppins font-medium text-foreground text-lg mb-1">
                    Document Summarization
                  </h3>
                  <p className="text-muted-foreground">
                    Get instant summaries of your documents, PDFs, and presentations without opening them.
                  </p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                viewport={{ once: true }}
                className="flex items-start space-x-4"
              >
                <div className="bg-accent-blue/20 p-2 rounded-lg shrink-0 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-accent-cyan h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 19V9a2 2 0 0 0-2-2h-6.59a1.999 1.999 0 0 1-1.41-.59l-1-1a2 2 0 0 0-1.41-.59H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2Z" />
                    <path d="M9 13h6" />
                    <path d="M12 10v6" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-poppins font-medium text-foreground text-lg mb-1">Auto-Organization</h3>
                  <p className="text-muted-foreground">
                    AI automatically organizes your files into logical folders based on content and metadata.
                  </p>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
              className="mt-10"
            >
              <Button className="ripple hover-glow bg-accent-blue text-white font-medium py-3 px-6 rounded-2xl transition-all">
                Explore AI Features
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ x: 30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-primary-800/80 backdrop-blur-sm p-6 rounded-2xl border border-muted/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-poppins font-medium text-foreground">AI Assistant</h3>
                <div className="flex space-x-3">
                  <div className="bg-primary-900/60 py-1 px-3 rounded-full flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-accent-cyan mr-1.5 h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="18" height="10" x="3" y="11" rx="2" />
                      <circle cx="12" cy="5" r="2" />
                      <path d="M12 7v4" />
                      <line x1="8" x2="16" y1="16" y2="16" />
                    </svg>
                    <span className="text-xs text-foreground">GPT-4</span>
                  </div>
                  <button className="text-muted-foreground hover:text-foreground">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="bg-primary-900/60 rounded-xl p-5 mb-5 max-h-96 overflow-y-auto">
                <div className="space-y-5">
                  {/* User message */}
                  <div className="flex items-start space-x-3">
                    <div className="bg-accent-blue rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                    <div className="bg-primary-800/80 py-2.5 px-4 rounded-2xl rounded-tl-none">
                      <p className="text-foreground">
                        Can you find all my presentation files from last month and organize them into a new folder?
                      </p>
                    </div>
                  </div>

                  {/* AI response */}
                  <div className="flex items-start space-x-3">
                    <div className="ai-pulse bg-primary-900 rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-accent-cyan"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 22a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
                        <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
                        <path d="M15 9.5a3.5 3.5 0 0 0-3.5-3.5" />
                      </svg>
                    </div>
                    <div className="bg-primary-800/20 py-2.5 px-4 rounded-2xl rounded-tl-none">
                      <p className="text-foreground mb-3">I've found 8 presentation files from October 2023:</p>
                      <ul className="text-muted-foreground space-y-1.5 mb-3">
                        <li className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-accent-cyan mr-2"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z" />
                            <path d="M7 7h10" />
                            <path d="M7 12h10" />
                            <path d="M7 17h10" />
                          </svg>
                          <span>Q3_Results.pptx</span>
                        </li>
                        <li className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-accent-cyan mr-2"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z" />
                            <path d="M7 7h10" />
                            <path d="M7 12h10" />
                            <path d="M7 17h10" />
                          </svg>
                          <span>Marketing_Strategy.pptx</span>
                        </li>
                        <li className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-accent-cyan mr-2"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z" />
                            <path d="M7 7h10" />
                            <path d="M7 12h10" />
                            <path d="M7 17h10" />
                          </svg>
                          <span>Client_Proposal.pptx</span>
                        </li>
                        <li className="flex items-center text-muted-foreground/70">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-muted-foreground/70 mr-2"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="12" cy="5" r="1" />
                            <circle cx="12" cy="19" r="1" />
                          </svg>
                          <span>5 more files</span>
                        </li>
                      </ul>
                      <p className="text-foreground">
                        Would you like me to create a new folder called "October Presentations" and move these files there?
                      </p>
                    </div>
                  </div>

                  {/* User message */}
                  <div className="flex items-start space-x-3">
                    <div className="bg-accent-blue rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                    <div className="bg-primary-800/80 py-2.5 px-4 rounded-2xl rounded-tl-none">
                      <p className="text-foreground">
                        Yes, please. And could you also summarize what each presentation is about?
                      </p>
                    </div>
                  </div>

                  {/* AI typing indicator */}
                  {isTyping ? (
                    <div className="flex items-start space-x-3">
                      <div className="ai-pulse bg-primary-900 rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-accent-cyan"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 22a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
                          <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
                          <path d="M15 9.5a3.5 3.5 0 0 0-3.5-3.5" />
                        </svg>
                      </div>
                      <div className="bg-primary-800/20 py-3 px-4 rounded-2xl rounded-tl-none">
                        <div className="typing-dots">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-start space-x-3"
                    >
                      <div className="ai-pulse bg-primary-900 rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-accent-cyan"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 22a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
                          <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
                          <path d="M15 9.5a3.5 3.5 0 0 0-3.5-3.5" />
                        </svg>
                      </div>
                      <div className="bg-primary-800/20 py-2.5 px-4 rounded-2xl rounded-tl-none">
                        <p className="text-foreground mb-2">I've created the "October Presentations" folder and moved all the files there. Here are brief summaries of the main presentations:</p>
                        <ul className="text-muted-foreground space-y-2 mb-2">
                          <li>
                            <p className="font-medium text-foreground">Q3_Results.pptx</p>
                            <p>Financial results for Q3, highlighting a 15% revenue growth and key performance metrics across departments.</p>
                          </li>
                          <li>
                            <p className="font-medium text-foreground">Marketing_Strategy.pptx</p>
                            <p>Outlines the Q4 marketing campaign strategies, budget allocation, and expected ROI for digital channels.</p>
                          </li>
                          <li>
                            <p className="font-medium text-foreground">Client_Proposal.pptx</p>
                            <p>Project proposal for Enterprise Solutions Inc., including timeline, resources, and pricing structure.</p>
                          </li>
                        </ul>
                        <p className="text-foreground">Would you like me to analyze any of these presentations in more detail?</p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Ask your AI assistant..."
                  className="glow-border w-full bg-primary-900/60 border border-muted/50 rounded-xl py-3 px-4 text-foreground focus:outline-none"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-accent-blue hover:text-accent-cyan transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m22 2-7 20-4-9-9-4Z" />
                    <path d="M22 2 11 13" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
