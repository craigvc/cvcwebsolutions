const fetch = require('node-fetch');

async function createImpressumPage() {
  console.log('Creating Impressum (Imprint) page...\n');
  
  const impressumData = {
    title: 'Impressum',
    slug: 'impressum',
    status: 'published',
    content: `
      <h2>Angaben gemäß § 5 TMG</h2>
      <p>
        CVC Web Solutions<br />
        Craig Van Calcar<br />
        Berlin, Germany
      </p>

      <h2>Kontakt</h2>
      <p>
        Telefon: +49 (0)30 3387 5008<br />
        E-Mail: info@cvcwebsolutions.com
      </p>

      <h2>EU-Streitschlichtung</h2>
      <p>
        Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
        <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr/</a><br />
        Unsere E-Mail-Adresse finden Sie oben im Impressum.
      </p>

      <h2>Verbraucherstreitbeilegung/Universalschlichtungsstelle</h2>
      <p>
        Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer 
        Verbraucherschlichtungsstelle teilzunehmen.
      </p>

      <h2>Haftung für Inhalte</h2>
      <p>
        Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den 
        allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht 
        verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen 
        zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
      </p>
      <p>
        Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen 
        Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt 
        der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden 
        Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
      </p>

      <h2>Haftung für Links</h2>
      <p>
        Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. 
        Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der 
        verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die 
        verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. 
        Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.
      </p>

      <h2>Urheberrecht</h2>
      <p>
        Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen 
        Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der 
        Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. 
        Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
      </p>
    `,
    seo: {
      metaTitle: 'Impressum - CVC Web Solutions',
      metaDescription: 'Legal information and imprint for CVC Web Solutions as required by German law (§ 5 TMG).',
      metaKeywords: 'impressum, imprint, legal notice, angaben gemäß tmg'
    }
  };

  try {
    // Check if impressum page already exists
    const checkResponse = await fetch('http://localhost:3456/api/pages?where[slug][equals]=impressum&limit=1');
    const checkData = await checkResponse.json();
    
    if (checkData.docs && checkData.docs.length > 0) {
      console.log('⚠ Impressum page already exists (ID: ' + checkData.docs[0].id + ')');
      console.log('Updating existing page...\n');
      
      const updateResponse = await fetch(`http://localhost:3456/api/pages/${checkData.docs[0].id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(impressumData)
      });
      
      if (updateResponse.ok) {
        const updatedPage = await updateResponse.json();
        console.log('✓ Impressum page updated successfully!');
        console.log(`  URL: /impressum`);
        console.log(`  Page ID: ${updatedPage.doc.id}`);
      } else {
        const errorText = await updateResponse.text();
        console.error('✗ Failed to update page:', updateResponse.status);
        console.error(errorText);
      }
      return;
    }

    // Create new page
    const response = await fetch('http://localhost:3456/api/pages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(impressumData)
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✓ Impressum page created successfully!');
      console.log(`  URL: /impressum`);
      console.log(`  Page ID: ${data.doc.id}`);
      console.log('\nNext steps:');
      console.log('  1. Update the Footer component to add a link to /impressum');
      console.log('  2. Review and customize the content with your specific business details');
    } else {
      const errorText = await response.text();
      console.error('✗ Failed to create page:', response.status);
      console.error(errorText);
    }

  } catch (error) {
    console.error('✗ Error:', error.message);
  }
}

createImpressumPage();
