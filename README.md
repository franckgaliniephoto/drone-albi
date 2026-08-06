# Site Drone Albi — Franck G. Photographie

Site vitrine statique, responsive et optimisé SEO/GEO pour GitHub Pages.
Adresse : `https://franckgaliniephoto.github.io/drone-albi/`

## Structure du site

| Page | Rôle |
| --- | --- |
| `index.html` | Accueil, prestations, déroulement, FAQ complète, formulaire de devis |
| `inspection-toiture-drone-albi.html` | Prestation inspection visuelle de toiture |
| `drone-immobilier-albi.html` | Prestation photo et vidéo immobilière |
| `drone-evenementiel-tarn.html` | Prestation captation événementielle |
| `suivi-chantier-surveillance-drone-tarn.html` | Prestation suivi de chantier et observation |
| `tarifs-devis-drone-albi.html` | Critères de tarification et contenu d’un devis |
| `reglementation-drone-albi-tarn.html` | Réglementation, zones de restriction, glossaire |
| `zones-intervention.html` | Communes couvertes et distances indicatives |
| `mentions-legales.html`, `politique-confidentialite.html` | Pages légales |
| `merci.html`, `404.html` | Confirmation d’envoi et page d’erreur (`noindex`) |

Fichiers pour les moteurs : `robots.txt`, `sitemap.xml`, `llms.txt`, `manifest.webmanifest`, `.nojekyll`.

## Mise en ligne

1. Déposez tous les fichiers à la racine du dépôt **drone-albi** du compte **franckgaliniephoto**.
2. Dans **Settings → Pages**, choisissez **Deploy from a branch**, branche **main**, dossier **/(root)**.
3. Envoyez une première fois le formulaire, puis validez l’email d’activation de FormSubmit.

Si le nom du dépôt ou le domaine change, remplacez partout `https://franckgaliniephoto.github.io/drone-albi/` :
balises `canonical`, `hreflang`, Open Graph, JSON-LD, `sitemap.xml`, `robots.txt`, `llms.txt` et le champ `_next` du formulaire.

## Optimisations SEO en place

**Technique**

- Titres et méta-descriptions uniques, calibrés (titres ≤ 65 caractères, descriptions 120–185)
- `canonical`, `hreflang` fr-FR et `x-default` sur chaque page
- Balises géographiques `geo.region`, `geo.placename`, `geo.position`, `ICBM`
- `preconnect` et `dns-prefetch` vers l’hébergeur d’images, `preload` de l’image LCP de l’accueil
- Sitemap XML avec extension image, `robots.txt` détaillé, `.nojekyll`
- Open Graph et Twitter Cards complets, manifeste PWA avec raccourcis
- Pages `merci.html` et `404.html` en `noindex`, exclues du sitemap et de `robots.txt`

**Données structurées (JSON-LD, graphe unifié par `@id`)**

- `LocalBusiness` + `ProfessionalService` + `PhotographBusiness` : adresse, `geo`, `hasMap`,
  SIRET, `areaServed` détaillé, `serviceArea` (GeoCircle 60 km), `hasOfferCatalog`
- `Person` : Franck Galinié, `hasCredential` (RS6699, CATS, BAPD), `memberOf` (FPDC) — signaux E-E-A-T
- `WebSite`, `WebPage` (avec `datePublished`/`dateModified`, `speakable`, `primaryImageOfPage`)
- `BreadcrumbList` sur toutes les pages internes
- `Service` par prestation, avec `hasOfferCatalog`, `areaServed` et `availableChannel`
- `FAQPage` sur 8 pages, `HowTo` (déroulement d’une mission), `ItemList`, `Article`

**Éditorial et maillage**

- Encadré « en bref » sur chaque page principale : réponse directe + fiche de faits structurée
- FAQ étendues : 12 questions sur l’accueil, 8 par page de prestation
- Tableaux de données (critères de tarification, contraintes de vol, distances par commune)
- Deux pages piliers : tarifs/devis et réglementation/faisabilité
- Navigation à 7 entrées, pied de page à 4 colonnes, blocs de liens internes en fin de page

## Optimisation GEO (moteurs génératifs)

- `llms.txt` : résumé structuré du site pour les assistants IA, avec une section
  « points de précision à ne pas déformer » (inspection visuelle sans thermographie,
  pas de survol du public, aucun avis client à inventer)
- `robots.txt` autorisant explicitement GPTBot, ClaudeBot, PerplexityBot, Google-Extended,
  OAI-SearchBot, Applebot-Extended, CCBot et consorts
- Contenus « citables » : définitions en tête de page, listes de faits, tableaux comparatifs,
  réponses complètes et autonomes dans les FAQ
- `speakable` déclaré sur les encadrés de synthèse pour la recherche vocale

## Cohérence des données structurées

Les réponses des blocs `FAQPage` reprennent mot pour mot les FAQ visibles :
**toute modification d’une question doit être faite aux deux endroits**, sinon Google peut
ignorer le balisage. Contrôle rapide, à lancer à la racine du dépôt :

```bash
python3 - <<'EOF'
import json, re, pathlib, html as H
for p in sorted(pathlib.Path('.').glob('*.html')):
    h = p.read_text(encoding='utf-8')
    text = re.sub(r'\s+', ' ', H.unescape(re.sub(r'<[^>]+>', '', h.split('<body', 1)[-1])))
    for m in re.finditer(r'<script type="application/ld\+json">(.*?)</script>', h, re.S):
        for n in json.loads(m.group(1)).get('@graph', []):
            if n.get('@type') == 'FAQPage':
                for q in n['mainEntity']:
                    for v in (q['name'], q['acceptedAnswer']['text']):
                        if re.sub(r'\s+', ' ', v) not in text:
                            print('ABSENT du contenu visible :', p.name, v[:60])
EOF
```

## À vérifier / compléter

- **Horaires d’ouverture** : non publiés, donc volontairement absents du JSON-LD.
  Pour les ajouter, insérer un `openingHoursSpecification` dans le nœud `#business`
  et les afficher aussi sur le site.
- **Coordonnées GPS** : le JSON-LD utilise les coordonnées exactes communiquées
  pour le studio du 23 avenue Germain Téqui : 43.94851456213975 / 2.210739448460117.
- **SIRET et statut juridique** : à confirmer avant publication.
- **Avis clients** : aucun `AggregateRating` n’a été ajouté, car publier une note inventée
  enfreint les règles de Google et fait courir un risque juridique. À n’ajouter qu’avec
  de vrais avis vérifiables.
- **Images** : les deux photos de l’accueil sont encore hébergées sur Wix. Les remplacer par
  des fichiers locaux en WebP ou AVIF dans `assets/` améliorerait nettement les Core Web Vitals.
- **Réglementation** : la page dédiée résume l’état des règles à la date de rédaction.
  Elle renvoie aux sources officielles, qui font foi ; à relire lors de chaque évolution.

## SEO local après la mise en ligne

1. Ajoutez le site dans Google Search Console et envoyez `sitemap.xml`.
2. Demandez l’indexation de l’accueil et des six pages principales.
3. Ajoutez l’adresse du site à la fiche **Google Business Profile** et à `franckgphotographie.fr`.
4. Créez depuis `franckgphotographie.fr` un lien visible vers ce mini-site, avec une ancre
   naturelle comme « Prestations drone à Albi et dans le Tarn ».
5. Publiez de vrais exemples locaux : inspection à Saint-Juéry, immobilier à Albi,
   suivi de chantier dans le Tarn, avec l’accord des clients.
6. Recueillez des avis clients mentionnant naturellement la prestation et la commune.
7. Mettez à jour les `lastmod` du sitemap et la date du pied de page à chaque modification.

## Important

Aucune technique SEO ne garantit une première position. Le site fournit une base technique
et éditoriale solide ; le positionnement dépendra aussi de l’ancienneté du domaine, des liens
entrants, de la fiche Google Business Profile, des avis, de la concurrence locale et de la
publication régulière de réalisations.
