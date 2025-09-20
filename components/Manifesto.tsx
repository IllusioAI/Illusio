"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ManifestoProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Manifesto({ isOpen, onClose }: ManifestoProps) {
  const manifestoText = `ILLUSIO exists because markets behave like a simulation that insists it is real. Prices flicker, stories stack on stories, and a quieter signal moves underneath the noise. Our work is to build an instrument that finds that signal early, while action is still cheap and reversible.

We treat every token as an experiment. We start by observing what is actually there, who arrives, who leaves, where the flow holds or slips, and which moves are natural versus staged. We look for the small, honest bends that precede the loud turns. If the world changes, our read changes with it. The instrument updates, and so do we.

Then we clean the record so the history you act on is trustworthy. We strip out planted theatrics and keep what survives a second look. From there, we let tomorrow speak to today. We simulate plausible paths and listen for the footprints they would leave in the present. When those prints appear, we lean in. When they do not, we stand down.

All of this is visible. The Retrocausality Lab shows live flow as pulses through a simple diagram. Branches light, views update, and you watch cause and effect meet in the middle in real time. Every claim is inspectable. Every change of mind is recorded. Confidence comes from evidence, not volume.

This is not prophecy. It is craft. Measure, clean, simulate, compare, then act when the picture is clear and still early. We prefer discipline over noise, transparency over mystique, and reversibility over bravado. Certainty is not available. Clarity is. Our promise is the same each day: clarity before consensus.`;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[50] bg-black/80 backdrop-blur-sm flex items-center justify-center p-8 cursor-default"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-black/90 border border-white/20 rounded-lg p-6 max-w-4xl h-[80vh] relative cursor-default flex flex-col"
            onClick={(e) => e.stopPropagation()}
            style={{
              fontFamily: ' STILL, monospace',
            }}
          >
            {/* Manifesto content */}
            <div className="text-white leading-relaxed space-y-4 flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-4 border-b border-white/20 pb-3">
                <h1 className="text-2xl font-bold">
                  MANIFESTO
                </h1>
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="text-white/60 hover:text-white transition-colors duration-200 text-2xl ml-4 cursor-pointer"
                  aria-label="Close manifesto"
                >
                  ×
                </button>
              </div>
              
              <div className="text-base space-y-4 flex-1 overflow-hidden">
                {manifestoText.split('\n\n').map((paragraph, index) => {
                  const isHeader = paragraph.startsWith('WE START') || paragraph.startsWith('ALL OF THIS') || paragraph.startsWith('ILLUSIO');
                  const isAgentSection = paragraph.includes('THE ANALYZER') || paragraph.includes('THE PREDICTOR') || paragraph.includes('THE QUANTUM ERASER');
                  
                  return (
                    <div key={index} className={isHeader ? 'border-l-4 border-white/40 pl-5' : ''}>
                      {isHeader ? (
                        <h2 className="text-xl font-bold text-white mb-3 tracking-wider">
                          {paragraph}
                        </h2>
                      ) : (
                        <p className={`leading-relaxed text-base ${isAgentSection ? 'ml-4 border-l border-white/10 pl-4' : ''}`}>
                          {paragraph}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* AI Infrastructure */}
              <div className="mt-4 pt-3 border-t border-white/20 flex-shrink-0">
                <h3 className="text-sm font-bold text-white mb-3 text-center">
                  POWERED BY
                </h3>
                <div className="flex justify-center items-center space-x-6">
                  <img src="/OPENAI.png" alt="OpenAI" className="h-8 opacity-60 hover:opacity-100 transition-opacity duration-200" />
                  <img src="/grok.png" alt="Grok" className="h-8 opacity-60 hover:opacity-100 transition-opacity duration-200" />
                  <img src="/GEMENI.png" alt="Gemini" className="h-8 opacity-60 hover:opacity-100 transition-opacity duration-200" />
                  <img src="/PERP.png" alt="Perplexity" className="h-8 opacity-60 hover:opacity-100 transition-opacity duration-200" />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
