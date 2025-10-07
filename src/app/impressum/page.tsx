'use client'

import { Metadata } from 'next';
import { useState } from 'react';

export default function ImpressumPage() {
  const [language, setLanguage] = useState<'de' | 'en'>('de');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Breadcrumb */}
      <div className="px-4 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-8">
            <a href="/" className="hover:text-purple-400 transition-colors">
              Home
            </a>
            <span>/</span>
            <span className="text-white">Impressum</span>
          </nav>
        </div>
      </div>

      <div className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800/90 rounded-2xl shadow-xl p-8 lg:p-12">
            {/* Language Tabs */}
            <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setLanguage('de')}
                className={`pb-4 px-4 font-semibold transition-colors ${
                  language === 'de'
                    ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Deutsch
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`pb-4 px-4 font-semibold transition-colors ${
                  language === 'en'
                    ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                English
              </button>
            </div>

            <h1 className="mb-8 text-4xl font-bold text-gray-900 dark:text-white">
              {language === 'de' ? 'Impressum' : 'Legal Notice'}
            </h1>

            <div className="space-y-8 text-gray-800 dark:text-gray-200">
              {language === 'de' ? (
                <>
                  <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Angaben gemäß § 5 TMG</h2>
                    <p className="leading-relaxed">
                      Adoptavia Germany UG (haftungsbeschränkt)<br />
                      Brehmestr. 11<br />
                      13187 Berlin<br />
                      Deutschland
                    </p>
                    <p className="leading-relaxed mt-4">
                      <strong>Registergericht:</strong> Amtsgericht Charlottenburg (Berlin)<br />
                      <strong>Registernummer:</strong> HRB 193153 B
                    </p>
                    <p className="leading-relaxed mt-4">
                      <strong>Vertreten durch:</strong><br />
                      James von Chamier (Geschäftsführer)
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Kontakt</h2>
                    <p className="leading-relaxed">
                      Telefon: +49 (0)30 3387 5008<br />
                      E-Mail: <a href="mailto:info@cvcwebsolutions.com" className="text-purple-500 hover:text-purple-400 transition-colors">info@cvcwebsolutions.com</a>
                    </p>
                  </section>
                </>
              ) : (
                <>
                  <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Information pursuant to § 5 TMG</h2>
                    <p className="leading-relaxed">
                      Adoptavia Germany UG (haftungsbeschränkt)<br />
                      Brehmestr. 11<br />
                      13187 Berlin<br />
                      Germany
                    </p>
                    <p className="leading-relaxed mt-4">
                      <strong>Register Court:</strong> District Court Charlottenburg (Berlin)<br />
                      <strong>Registration Number:</strong> HRB 193153 B
                    </p>
                    <p className="leading-relaxed mt-4">
                      <strong>Represented by:</strong><br />
                      James von Chamier (Managing Director)
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Contact</h2>
                    <p className="leading-relaxed">
                      Phone: +49 (0)30 3387 5008<br />
                      Email: <a href="mailto:info@cvcwebsolutions.com" className="text-purple-500 hover:text-purple-400 transition-colors">info@cvcwebsolutions.com</a>
                    </p>
                  </section>
                </>
              )}

              {language === 'de' ? (
                <>
                  <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">EU-Streitschlichtung</h2>
                    <p className="leading-relaxed">
                      Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
                      <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-purple-500 hover:text-purple-400 transition-colors underline">
                        https://ec.europa.eu/consumers/odr/
                      </a>
                      <br />
                      Unsere E-Mail-Adresse finden Sie oben im Impressum.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Verbraucherstreitbeilegung/Universalschlichtungsstelle</h2>
                    <p className="leading-relaxed">
                      Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
                      Verbraucherschlichtungsstelle teilzunehmen.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Haftung für Inhalte</h2>
                    <p className="leading-relaxed mb-4">
                      Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den
                      allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht
                      verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen
                      zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
                    </p>
                    <p className="leading-relaxed">
                      Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen
                      Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt
                      der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden
                      Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Haftung für Links</h2>
                    <p className="leading-relaxed">
                      Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben.
                      Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der
                      verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die
                      verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft.
                      Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Urheberrecht</h2>
                    <p className="leading-relaxed">
                      Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen
                      Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der
                      Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
                      Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
                    </p>
                  </section>
                </>
              ) : (
                <>
                  <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">EU Dispute Resolution</h2>
                    <p className="leading-relaxed">
                      The European Commission provides a platform for online dispute resolution (ODR):{' '}
                      <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-purple-500 hover:text-purple-400 transition-colors underline">
                        https://ec.europa.eu/consumers/odr/
                      </a>
                      <br />
                      Our email address can be found above in the legal notice.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Consumer Dispute Resolution</h2>
                    <p className="leading-relaxed">
                      We are neither willing nor obliged to participate in dispute resolution proceedings before a consumer arbitration board.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Liability for Content</h2>
                    <p className="leading-relaxed mb-4">
                      As a service provider, we are responsible for our own content on these pages in accordance with § 7 Para. 1 TMG under general law. However, according to §§ 8 to 10 TMG, we as a service provider are not obliged to monitor transmitted or stored third-party information or to investigate circumstances that indicate illegal activity.
                    </p>
                    <p className="leading-relaxed">
                      Obligations to remove or block the use of information according to general laws remain unaffected. However, liability in this regard is only possible from the point in time at which knowledge of a specific legal violation is known. Upon becoming aware of corresponding legal violations, we will remove this content immediately.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Liability for Links</h2>
                    <p className="leading-relaxed">
                      Our website contains links to external third-party websites over whose content we have no influence. Therefore, we cannot assume any liability for this third-party content. The respective provider or operator of the pages is always responsible for the content of the linked pages. The linked pages were checked for possible legal violations at the time of linking. Illegal content was not recognizable at the time of linking.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Copyright</h2>
                    <p className="leading-relaxed">
                      The content and works created by the site operators on these pages are subject to German copyright law. The reproduction, editing, distribution and any kind of exploitation outside the limits of copyright law require the written consent of the respective author or creator. Downloads and copies of this site are only permitted for private, non-commercial use.
                    </p>
                  </section>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
