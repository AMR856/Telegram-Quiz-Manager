'use client'

import { AnimatePresence, motion } from 'framer-motion'
import {
  Header,
  Navigation,
  ToastNotification,
  DashboardTab,
  AuthTab,
  ImagesTab,
  QuizzesTab,
  JobsTab,
  Insights,
  ResponseDisplay,
} from '@/components'
import { useAppState } from '@/hooks'
import { TAB_IDS } from '@/lib/constants'

export default function Page() {
  const state = useAppState()

  return (
    <div className="relative min-h-screen bg-slate-900 text-slate-100">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-32 right-[-10%] h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-10%] h-80 w-80 rounded-full bg-sky-400/10 blur-3xl" />
      </div>
      <Header
        health={state.health}
        backendUrl={state.backendUrl}
        apiKey={state.apiKey}
        onBackendUrlChange={state.setBackendUrl}
        onApiKeyChange={state.setApiKey}
      />

      <Navigation activeTab={state.activeTab} onTabChange={state.setActiveTab} />

      <main className="mx-auto grid w-full max-w-7xl gap-6 px-5 pb-16 pt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={state.activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="grid gap-6"
          >
            {state.activeTab === TAB_IDS.DASHBOARD && (
              <DashboardTab healthLabel={state.healthLabel} quickStats={state.quickStats} />
            )}

            {state.activeTab === TAB_IDS.AUTH && (
              <AuthTab
                authData={state.authData}
                loading={state.loading}
                onAuthDataChange={state.setAuthData}
                onSignIn={state.signIn}
              />
            )}

            {state.activeTab === TAB_IDS.IMAGES && (
              <ImagesTab
                imagesLimit={state.imagesLimit}
                imagesCursor={state.imagesCursor}
                imageFile={state.imageFile}
                images={state.images}
                activeImage={state.activeImage}
                loading={state.loading}
                onSelectImage={state.setActiveIndex}
                onDeleteImage={state.deleteImageById}
                onImagesLimitChange={state.setImagesLimit}
                onImagesCursorChange={state.setImagesCursor}
                onImageFileChange={state.setImageFile}
                onUploadSingle={state.uploadSingleImage}
                onUploadMany={state.uploadMany}
                onFetchImages={state.fetchImages}
                onDeleteActiveImage={state.deleteActiveImage}
                onCarouselPrev={state.prev}
                onCarouselNext={state.next}
              />
            )}

            {state.activeTab === TAB_IDS.QUIZZES && (
              <QuizzesTab
                quizzes={state.quizzes}
                delayMs={state.delayMs}
                retryWrongAfterMinutes={state.retryWrongAfterMinutes}
                loading={state.loading}
                onQuizzesChange={state.setQuizzes}
                onDelayChange={state.setDelayMs}
                onRetryWrongAfterMinutesChange={state.setRetryWrongAfterMinutes}
                onSend={state.sendQuizzes}
              />
            )}

            {state.activeTab === TAB_IDS.JOBS && (
              <JobsTab
                jobId={state.jobId}
                jobStatus={state.jobStatus}
                loading={state.loading}
                onJobIdChange={state.setJobId}
                onCheckJob={state.checkJob}
              />
            )}
          </motion.div>
        </AnimatePresence>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Insights insights={state.insights} />
          <ResponseDisplay meta={state.latestMeta} response={state.latestResponse} />
        </section>
      </main>

      <ToastNotification toast={state.toast} />
    </div>
  )
}