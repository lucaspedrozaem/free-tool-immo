"use client";

import { useState } from "react";
import { PhotoDropzone } from "@/components/PhotoDropzone";
import { ProgressBar } from "@/components/ProgressBar";
import { ResultsPanel } from "@/components/ResultsPanel";
import { FAQSection } from "@/components/FAQSection";
import Image from "next/image";
import Link from "next/link";
import type {
  ProcessingOptions,
  ProcessedImage,
  ProcessingProgress,
} from "@/lib/image-processing";
import { processImages } from "@/lib/image-processing";

type AppState = "upload" | "configure" | "processing" | "done";

interface ToolPageLayoutProps {
  title: string;
  subtitle: string;
  description: string;
  whyTitle: string;
  whyContent: string;
  howTitle: string;
  howSteps: string[];
  complianceNote?: string;
  internalLink?: { text: string; href: string };
  faqItems: { question: string; answer: string }[];
  renderConfig: (
    files: File[],
    onProcess: (options: ProcessingOptions) => void
  ) => React.ReactNode;
  dropzoneDescription?: string;
  acceptFormats?: Record<string, string[]>;
  illustration?: string;
}

export function ToolPageLayout({
  title,
  subtitle,
  description,
  whyTitle,
  whyContent,
  howTitle,
  howSteps,
  complianceNote,
  internalLink,
  faqItems,
  renderConfig,
  dropzoneDescription,
  acceptFormats,
  illustration,
}: ToolPageLayoutProps) {
  const [state, setState] = useState<AppState>("upload");
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState<ProcessingProgress>({
    current: 0,
    total: 0,
    currentFile: "",
    stage: "Processing",
  });
  const [results, setResults] = useState<ProcessedImage[]>([]);

  const handleFiles = (newFiles: File[]) => {
    setFiles(newFiles);
    setState("configure");
  };

  const handleProcess = async (options: ProcessingOptions) => {
    setState("processing");
    try {
      const processed = await processImages(files, options, setProgress);
      setResults(processed);
      setState("done");
    } catch (err) {
      console.error("Processing error:", err);
      setState("configure");
    }
  };

  const handleReset = () => {
    setFiles([]);
    setResults([]);
    setState("upload");
  };

  return (
    <>
      <section className="py-10 md:py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {state === "upload" && (
            <div className="text-center">
              {illustration && (
                <div className="mb-8">
                  <Image
                    src={illustration}
                    alt={title}
                    width={260}
                    height={195}
                    className="mx-auto rounded-2xl"
                    priority
                  />
                </div>
              )}
              <h1 className="font-heading font-extrabold text-3xl md:text-4xl lg:text-5xl text-midnight leading-tight">
                {title}
              </h1>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                {subtitle}
              </p>
              <div className="mt-8">
                <PhotoDropzone
                  onFiles={handleFiles}
                  accept={acceptFormats}
                  description={dropzoneDescription}
                />
              </div>
            </div>
          )}

          {state === "configure" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading font-bold text-2xl">
                  {files.length} Photo{files.length !== 1 ? "s" : ""} Ready
                </h2>
                <button
                  onClick={handleReset}
                  className="text-sm text-gray-500 hover:text-primary"
                >
                  Start Over
                </button>
              </div>
              {renderConfig(files, handleProcess)}
            </div>
          )}

          {state === "processing" && <ProgressBar progress={progress} />}
          {state === "done" && (
            <ResultsPanel images={results} onReset={handleReset} />
          )}
        </div>
      </section>

      {/* SEO Content */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-3xl mx-auto space-y-10">
          <div>
            <h2 className="font-heading font-bold text-2xl mb-4">
              {whyTitle}
            </h2>
            <p className="text-gray-600 leading-relaxed">{whyContent}</p>
          </div>

          <div>
            <h2 className="font-heading font-bold text-2xl mb-4">
              {howTitle}
            </h2>
            <ol className="space-y-3">
              {howSteps.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-gray-600 pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {complianceNote && (
            <div>
              <h3 className="font-heading font-bold text-xl mb-3">
                100% Free & California 2025 Compliant
              </h3>
              <p className="text-gray-600 leading-relaxed">{complianceNote}</p>
            </div>
          )}

          {internalLink && (
            <div className="bg-primary-light rounded-lg p-4">
              <Link
                href={internalLink.href}
                className="text-primary font-semibold hover:underline"
              >
                {internalLink.text} &rarr;
              </Link>
            </div>
          )}

          <div className="pt-4">
            <p className="text-gray-600 leading-relaxed">{description}</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading font-bold text-2xl text-center mb-8">
            Frequently Asked Questions
          </h2>
          <FAQSection items={faqItems} />
        </div>
      </section>
    </>
  );
}
