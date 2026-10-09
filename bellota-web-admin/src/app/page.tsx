import Link from 'next/link';
import { Leaf } from 'lucide-react';

export const metadata = {
  title: 'Bellota App — Tu compañera de salud',
  description: 'Descarga Bellota, la app de salud femenina para Android. Seguimiento del ciclo, centros de salud en Nicaragua y reportes PDF personalizados.',
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fdf6f0] text-stone-800">

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-3 bg-amber-800/90 backdrop-blur-sm shadow-sm">
        <div className="flex items-center gap-2 text-white font-bold text-lg tracking-wide">
          <div className="bg-white/20 p-1.5 rounded-lg">
            <Leaf className="w-4 h-4 text-white" />
          </div>
          Bellota
        </div>
        <Link
          href="/login"
          className="text-sm font-semibold text-white bg-white/15 border border-white/30 px-4 py-1.5 rounded-full hover:bg-white/25 transition-colors"
        >
          🔐 Panel Admin
        </Link>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center text-center px-5 pt-24 pb-20 overflow-hidden bg-gradient-to-br from-amber-900 via-amber-700 to-amber-400">
        {/* Blob decorations */}
        <div className="absolute top-[-80px] right-[-80px] w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-60px] left-[-60px] w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto text-white">
          <span className="inline-block bg-white/15 border border-white/30 text-sm font-semibold px-4 py-1.5 rounded-full mb-7 tracking-wide">
            🌿 Disponible en Android
          </span>

          {/* App icon placeholder */}
          <div className="w-24 h-24 bg-white/20 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl">
            <Leaf className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold tracking-widest mb-4">Bellota</h1>
          <p className="text-xl md:text-2xl opacity-90 mb-3 font-light">
            Tu compañera inteligente de salud femenina
          </p>
          <p className="text-sm opacity-65 mb-10">
            Seguimiento del ciclo · Centros de salud en Nicaragua · Reportes PDF personalizados
          </p>

          <div className="flex flex-col items-center gap-3">
            <a
              href="/downloads/app-release.apk"
              download
              className="inline-block bg-white text-amber-800 font-bold text-base px-10 py-4 rounded-full shadow-2xl hover:-translate-y-1 hover:shadow-amber-900/30 transition-all duration-200"
            >
              ⬇️ Descargar App (Android)
            </a>
            <p className="text-xs opacity-55">Versión 1.0.0 · Compatible con Android 6.0+</p>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="bg-white shadow-sm py-7 px-5">
        <div className="max-w-2xl mx-auto flex items-center justify-center gap-0 divide-x divide-stone-200 flex-wrap">
          {[
            { value: '100%', label: 'Privada y segura' },
            { value: '☁️', label: 'Sincronización Azure' },
            { value: '🇳🇮', label: 'Hecha en Nicaragua' },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center px-8 py-2">
              <span className="text-2xl font-extrabold text-amber-800 leading-none">{s.value}</span>
              <span className="text-xs text-stone-400 mt-1 text-center">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-20 px-5 bg-[#fdf6f0] text-center">
        <p className="text-xs font-bold tracking-widest uppercase text-amber-600 mb-2">Funcionalidades</p>
        <h2 className="text-3xl font-extrabold text-amber-900 mb-3">¿Qué puedes hacer con Bellota?</h2>
        <p className="text-stone-500 text-sm max-w-md mx-auto mb-12 leading-relaxed">
          Todo lo que necesitas para cuidar tu salud femenina, en un solo lugar.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-4xl mx-auto">
          {[
            { icon: '📅', title: 'Seguimiento del ciclo', desc: 'Registra y predice tu ciclo menstrual con inteligencia artificial. Nunca más te tome por sorpresa.' },
            { icon: '🗺️', title: 'Centros de salud', desc: 'Encuentra hospitales y clínicas cercanas en Nicaragua con mapa interactivo y horarios.' },
            { icon: '📊', title: 'Reportes de salud', desc: 'Genera reportes PDF personalizados con tu historial de síntomas para llevar al médico.' },
            { icon: '☁️', title: 'Sincronización en la nube', desc: 'Tu cuenta se guarda de forma segura en Azure. Accede desde cualquier dispositivo Android.' },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-2xl p-7 text-left shadow-sm border border-stone-100 hover:-translate-y-1.5 hover:shadow-md transition-all duration-200"
            >
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-2xl mb-4">
                {f.icon}
              </div>
              <h3 className="font-bold text-amber-900 mb-2 text-sm">{f.title}</h3>
              <p className="text-stone-500 text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW TO INSTALL ── */}
      <section className="py-20 px-5 bg-white">
        <div className="max-w-lg mx-auto">
          <p className="text-xs font-bold tracking-widest uppercase text-amber-600 mb-2">Guía rápida</p>
          <h2 className="text-3xl font-extrabold text-amber-900 mb-10">¿Cómo instalar?</h2>

          <ol className="space-y-6">
            {[
              { n: 1, title: 'Descarga el APK', body: 'Pulsa el botón de descarga. Se guardará el archivo app-release.apk en tu dispositivo.' },
              { n: 2, title: 'Habilita fuentes desconocidas', body: 'Ve a Ajustes → Seguridad → Fuentes desconocidas y activa la opción.' },
              { n: 3, title: 'Instala la app', body: 'Abre el archivo descargado desde el gestor de archivos y presiona "Instalar".' },
              { n: 4, title: '¡Listo! Crea tu cuenta', body: 'Regístrate con tu correo electrónico y empieza a usar Bellota de forma gratuita.' },
            ].map((s) => (
              <li key={s.n} className="flex gap-5 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-amber-800 to-amber-500 text-white font-extrabold flex items-center justify-center shadow-sm">
                  {s.n}
                </div>
                <div>
                  <p className="font-bold text-amber-900 text-sm">{s.title}</p>
                  <p className="text-stone-500 text-xs leading-relaxed mt-1">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>

          {/* CTA */}
          <div className="mt-12 bg-gradient-to-br from-amber-800 to-amber-600 rounded-2xl p-8 text-center text-white">
            <p className="font-semibold mb-4 opacity-90">¿Lista para empezar?</p>
            <a
              href="/downloads/app-release.apk"
              download
              className="inline-block bg-white text-amber-800 font-bold px-8 py-3 rounded-full shadow-lg hover:-translate-y-1 transition-all duration-200"
            >
              ⬇️ Descargar Bellota
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-amber-950 text-white py-10 px-5 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="bg-white/15 p-1.5 rounded-lg">
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-lg tracking-wide">Bellota</span>
        </div>
        <p className="text-xs opacity-50 mb-3">
          Tu compañera inteligente de salud femenina · Hecha en Nicaragua 🇳🇮
        </p>
        <div className="flex items-center justify-center gap-3 text-xs text-amber-300 flex-wrap mb-4">
          <a href="http://57.156.59.12:8000/docs" target="_blank" rel="noopener" className="hover:opacity-75 transition-opacity">
            📡 API Docs
          </a>
          <span className="opacity-30">·</span>
          <Link href="/login" className="hover:opacity-75 transition-opacity">
            🔐 Panel Admin
          </Link>
        </div>
        <p className="text-xs opacity-30">© {new Date().getFullYear()} Bellota App · Servidor en Azure (57.156.59.12)</p>
      </footer>
    </div>
  );
}
