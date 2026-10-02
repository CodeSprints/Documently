<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { normaliseError, type AppError, userMessage } from './lib/errors'

type View = 'home' | 'app' | 'docs'
type Workspace = { id: number; name: string; description: string; files: number; updated: string }

const view = ref<View>(location.pathname.startsWith('/docs') ? 'docs' : location.pathname.startsWith('/app') ? 'app' : 'home')
const mobileMenu = ref(false)
const activeTab = ref<'overview' | 'documents' | 'chat'>('overview')
const query = ref('')
const search = ref('')
const errors = ref<AppError[]>([])
const dialogOpen = ref(false)
const workspaceName = ref('')
const selectedWorkspace = ref<Workspace | null>(null)
const workspaces = ref<Workspace[]>([
  { id: 1, name: 'Umowy handlowe', description: 'Przegląd umów i zobowiązań', files: 12, updated: 'Dzisiaj, 09:42' },
  { id: 2, name: 'Badania Q3', description: 'Raporty i materiały analityczne', files: 7, updated: 'Wczoraj, 16:10' },
])
const sampleMessages = ref([{ role: 'assistant', text: 'Witaj w Documently. Wybierz dokument lub zadaj pytanie, aby rozpocząć.' }])
const filteredWorkspaces = computed(() => workspaces.value.filter(item => `${item.name} ${item.description}`.toLowerCase().includes(search.value.toLowerCase())))
const currentTitle = computed(() => selectedWorkspace.value?.name || 'Twoje przestrzenie')

function navigate(next: View) {
  view.value = next
  mobileMenu.value = false
  history.pushState({}, '', next === 'home' ? '/' : `/${next}`)
}
function showWorkspace(workspace: Workspace) {
  selectedWorkspace.value = workspace
  activeTab.value = 'overview'
  navigate('app')
}
function createWorkspace() {
  if (!workspaceName.value.trim()) return
  const item = { id: Date.now(), name: workspaceName.value.trim(), description: 'Nowa przestrzeń robocza', files: 0, updated: 'Teraz' }
  workspaces.value.unshift(item)
  workspaceName.value = ''
  dialogOpen.value = false
  selectedWorkspace.value = item
}
function addDocument() {
  if (!selectedWorkspace.value) return
  selectedWorkspace.value.files += 1
  const target = workspaces.value.find(item => item.id === selectedWorkspace.value?.id)
  if (target) target.files = selectedWorkspace.value.files
  activeTab.value = 'documents'
}
function askQuestion() {
  const text = query.value.trim()
  if (!text) return
  sampleMessages.value.push({ role: 'user', text })
  sampleMessages.value.push({ role: 'assistant', text: 'Analizuję Twoje dokumenty. W wersji produkcyjnej odpowiedź będzie zawierała cytaty i numery stron.' })
  query.value = ''
}
function captureError(error: unknown, context: string) {
  errors.value.unshift(normaliseError(error, context))
  if (errors.value.length > 3) errors.value.pop()
}
function dismissError(id: string) { errors.value = errors.value.filter(item => item.id !== id) }
function handleError(event: ErrorEvent) { captureError(event.error || event.message, 'Błąd interfejsu') }
function handleRejection(event: PromiseRejectionEvent) { captureError(event.reason, 'Nieobsłużona operacja') }
function handlePopState() { view.value = location.pathname.startsWith('/docs') ? 'docs' : location.pathname.startsWith('/app') ? 'app' : 'home' }
onMounted(() => { window.addEventListener('error', handleError); window.addEventListener('unhandledrejection', handleRejection); window.addEventListener('popstate', handlePopState) })
onUnmounted(() => { window.removeEventListener('error', handleError); window.removeEventListener('unhandledrejection', handleRejection); window.removeEventListener('popstate', handlePopState) })
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-950">
    <header class="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <button class="flex items-center gap-2 rounded-lg focus-ring" aria-label="Documently, strona główna" @click="navigate('home')"><span class="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 font-bold text-white">D</span><span class="text-lg font-bold tracking-tight">Documently</span></button>
        <nav class="hidden items-center gap-1 md:flex" aria-label="Główna nawigacja"><button class="nav-link" :class="{ active: view === 'home' }" @click="navigate('home')">Start</button><button class="nav-link" :class="{ active: view === 'app' }" @click="navigate('app')">Aplikacja</button><button class="nav-link" :class="{ active: view === 'docs' }" @click="navigate('docs')">Dokumentacja</button></nav>
        <div class="flex items-center gap-2"><button class="button-secondary hidden sm:inline-flex" @click="navigate('app')">Zaloguj się</button><button class="button-primary" @click="navigate('app')">Wypróbuj bezpłatnie</button><button class="icon-button md:hidden" aria-label="Otwórz menu" :aria-expanded="mobileMenu" @click="mobileMenu = !mobileMenu">☰</button></div>
      </div>
      <nav v-if="mobileMenu" class="border-t border-slate-200 px-4 py-3 md:hidden" aria-label="Mobilna nawigacja"><button class="mobile-link" @click="navigate('home')">Start</button><button class="mobile-link" @click="navigate('app')">Aplikacja</button><button class="mobile-link" @click="navigate('docs')">Dokumentacja</button></nav>
    </header>

    <main>
      <section v-if="view === 'home'" class="hero-shell"><div class="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28"><div class="max-w-3xl"><p class="eyebrow">Inteligencja dokumentów dla zespołów</p><h1 class="mt-5 text-4xl font-bold tracking-tight text-white sm:text-6xl">Przestań czytać dokumenty. <span class="text-indigo-300">Zacznij je rozumieć.</span></h1><p class="mt-6 max-w-2xl text-lg leading-8 text-slate-300">Prześlij PDF, zadawaj pytania prostym językiem i otrzymuj odpowiedzi z potwierdzonym źródłem. Szybciej, bezpieczniej i bez zgadywania.</p><div class="mt-9 flex flex-col gap-3 sm:flex-row"><button class="button-primary button-large" @click="navigate('app')">Rozpocznij pracę <span aria-hidden="true">→</span></button><button class="button-dark" @click="navigate('docs')">Zobacz dokumentację</button></div></div><div class="mt-16 grid gap-4 sm:grid-cols-3"><div v-for="item in [['01','Prześlij PDF'],['02','Zadaj pytanie'],['03','Zweryfikuj źródło']]" :key="item[0]" class="border-t border-slate-700 pt-4"><strong class="text-indigo-300">{{ item[0] }}</strong><p class="mt-2 text-sm text-slate-300">{{ item[1] }}</p></div></div></div></section>
      <section v-else-if="view === 'docs'" class="mx-auto max-w-7xl px-4 py-12 sm:px-6"><div class="max-w-3xl"><p class="eyebrow-light">Dokumentacja / Documentation</p><h1 class="page-title">Documently bez tajemnic</h1><p class="lead">Prosta instrukcja obsługi aplikacji, architektury i standardów jakości.</p></div><div class="mt-10 grid gap-6 lg:grid-cols-2"><article class="doc-card"><h2>PL · Szybki start</h2><p>Utwórz przestrzeń, dodaj dokument PDF i wybierz dokument z listy. Panel rozmowy przyjmuje pytania dotyczące treści. Odpowiedzi produkcyjne powinny zawierać cytat, numer strony i poziom pewności.</p><h3>Bezpieczeństwo</h3><p>Pliki są przypisane do użytkownika i przestrzeni. Dostęp do danych powinien być kontrolowany przez RLS w Supabase. Nie zapisuj sekretów w kodzie klienta.</p><h3>Obsługa błędów</h3><p>Interfejs przechwytuje błędy JavaScript i odrzucone obietnice. Użytkownik widzi komunikat, a zespół może otrzymać kontekst, czas i identyfikator zdarzenia.</p></article><article class="doc-card"><h2>EN · Quick start</h2><p>Create a workspace, add a PDF and select it from the list. Use the chat panel to ask questions about its content. Production responses should include a quote, page number and confidence level.</p><h3>Security</h3><p>Files belong to a user and a workspace. Access should be enforced with Supabase RLS. Never store secrets in client-side code.</p><h3>Error handling</h3><p>The interface captures JavaScript errors and rejected promises. Users receive a clear message while the team can inspect context, time and event id.</p></article></div></section>
      <section v-else class="mx-auto max-w-7xl px-4 py-10 sm:px-6"><div v-if="!selectedWorkspace"><div class="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p class="eyebrow-light">Centrum pracy</p><h1 class="page-title">Twoje przestrzenie</h1><p class="lead">Porządkuj dokumenty i pracuj na sprawdzonych informacjach.</p></div><button class="button-primary" @click="dialogOpen = true">＋ Nowa przestrzeń</button></div><div class="mt-8 flex flex-col gap-3 sm:flex-row"><label class="sr-only" for="workspace-search">Szukaj przestrzeni</label><input id="workspace-search" v-model="search" class="input max-w-md" placeholder="Szukaj przestrzeni..." type="search"><span class="self-center text-sm text-slate-500">{{ filteredWorkspaces.length }} przestrzeni</span></div><div class="mt-6 grid gap-4 md:grid-cols-2"> <button v-for="workspace in filteredWorkspaces" :key="workspace.id" class="workspace-card text-left" @click="showWorkspace(workspace)"><div class="flex items-start justify-between"><span class="grid h-11 w-11 place-items-center rounded-xl bg-indigo-50 text-xl text-indigo-600">▦</span><span class="text-xs text-slate-500">{{ workspace.updated }}</span></div><h2 class="mt-5 text-lg font-semibold">{{ workspace.name }}</h2><p class="mt-1 text-sm text-slate-500">{{ workspace.description }}</p><p class="mt-5 text-sm font-medium text-indigo-600">{{ workspace.files }} dokumentów <span aria-hidden="true">→</span></p></button></div></div>
        <div v-else><button class="mb-6 text-sm font-medium text-indigo-600 focus-ring" @click="selectedWorkspace = null">← Wszystkie przestrzenie</button><div class="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p class="eyebrow-light">Przestrzeń robocza</p><h1 class="page-title">{{ currentTitle }}</h1><p class="lead">{{ selectedWorkspace.description }}</p></div><button class="button-primary" @click="addDocument">＋ Dodaj dokument</button></div><div class="mt-8 border-b border-slate-200"><div class="flex gap-5" role="tablist" aria-label="Widok przestrzeni"><button v-for="tab in [['overview','Przegląd'],['documents','Dokumenty'],['chat','Rozmowa']]" :key="tab[0]" class="tab" :class="{ selected: activeTab === tab[0] }" role="tab" :aria-selected="activeTab === tab[0]" @click="activeTab = tab[0] as typeof activeTab">{{ tab[1] }}</button></div></div><div v-if="activeTab === 'overview'" class="mt-8 grid gap-5 md:grid-cols-3"><div class="stat-card"><span>Dokumenty</span><strong>{{ selectedWorkspace.files }}</strong><small>W tej przestrzeni</small></div><div class="stat-card"><span>Odpowiedzi</span><strong>24</strong><small>Z cytowanym źródłem</small></div><div class="stat-card"><span>Ostatnia aktywność</span><strong>09:42</strong><small>Dzisiaj</small></div></div><div v-else-if="activeTab === 'documents'" class="mt-8 panel"><h2 class="panel-title">Dokumenty w przestrzeni</h2><div class="mt-5 flex items-center justify-between rounded-xl border border-dashed border-indigo-300 bg-indigo-50/50 p-5"><div><p class="font-medium">Dodaj plik PDF</p><p class="mt-1 text-sm text-slate-500">Maksymalnie 20 MB. Tekst zostanie przygotowany do wyszukiwania.</p></div><button class="button-secondary" @click="addDocument">Wybierz plik</button></div></div><div v-else class="mt-8 panel"><h2 class="panel-title">Rozmowa z dokumentami</h2><div class="mt-5 space-y-3" aria-live="polite"><p v-for="(message, index) in sampleMessages" :key="index" class="message" :class="message.role">{{ message.text }}</p></div><form class="mt-6 flex gap-2" @submit.prevent="askQuestion"><label class="sr-only" for="question">Zadaj pytanie</label><input id="question" v-model="query" class="input" placeholder="Np. Jakie są terminy wypowiedzenia?" autocomplete="off"><button class="button-primary" type="submit">Wyślij</button></form></div></div></section>
    </main>

    <div v-if="dialogOpen" class="fixed inset-0 z-40 grid place-items-center bg-slate-950/40 p-4" role="presentation" @click.self="dialogOpen = false"><form class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" role="dialog" aria-modal="true" aria-labelledby="dialog-title" @submit.prevent="createWorkspace"><h2 id="dialog-title" class="text-xl font-bold">Nowa przestrzeń</h2><label class="mt-5 block text-sm font-medium" for="workspace-name">Nazwa przestrzeni</label><input id="workspace-name" v-model="workspaceName" class="input mt-2" required autofocus placeholder="Np. Umowy 2026"><div class="mt-6 flex justify-end gap-3"><button class="button-secondary" type="button" @click="dialogOpen = false">Anuluj</button><button class="button-primary" type="submit">Utwórz</button></div></form></div>
    <aside v-if="errors.length" class="fixed bottom-4 right-4 z-50 w-[min(22rem,calc(100%-2rem))] space-y-2" aria-live="assertive"><div v-for="error in errors" :key="error.id" class="rounded-xl border border-red-200 bg-white p-4 shadow-lg"><div class="flex items-start justify-between gap-3"><div><p class="font-semibold text-red-800">Coś poszło nie tak</p><p class="mt-1 text-sm text-slate-600">{{ userMessage(error.message) }}</p><p class="mt-2 text-xs text-slate-400">{{ error.context }} · {{ error.id.slice(0, 8) }}</p></div><button class="text-slate-400" aria-label="Zamknij komunikat" @click="dismissError(error.id)">×</button></div></div></aside>
    <footer class="border-t border-slate-200 bg-white"><div class="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6"><p>© 2026 Documently. Dokumenty pod kontrolą.</p><button class="focus-ring" @click="navigate('docs')">Dokumentacja PL / EN</button></div></footer>
  </div>
</template>
