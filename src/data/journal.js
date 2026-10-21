export const posts = [
  {
    slug: 'grading-chilgoza',
    title: 'How we grade chilgoza',
    date: '12 September 2026',
    kicker: 'Nuts',
    image: '/images/ridge.jpg',
    excerpt: 'The pine nut that pays for a whole season is also the one most often sold broken. Here is the sort we keep.',
    paragraphs: [
      'Chilgoza is a small harvest. The cones come off high pines in a short window, and a lot of what reaches a city market has already been crushed in the sack. We buy slower than that.',
      'A lot is graded on a wooden tray in Gilgit. Whole nuts stay. Split nuts are tasted — some are still good and go into the trail mix — and anything stale or soft is refused. The count we care about is simple: how many whole nuts sit in a hundred grams.',
      'The tins you receive are from that whole grade. They are not the cheapest pine nut in the market, and they are not meant to be. If a lot fails the tray, it does not get our mark.',
      'Store the tin sealed, away from a sunny shelf. Chilgoza’s oil is the point, and oil turns if it sits in heat.',
    ],
  },
  {
    slug: 'why-raw-honey-sets',
    title: 'Why raw honey sets hard',
    date: '2 August 2026',
    kicker: 'Honey',
    image: '/images/honey.jpg',
    excerpt: 'A jar that crystallises has not gone off. It has been left alone, which is what we prefer.',
    paragraphs: [
      'Wildflower honey from the meadows above Gilgit is packed as it comes from the comb. We strain it. We do not heat it to keep it pourable on a shop shelf.',
      'Crystals are the honey’s own sugars settling. A jar can turn from liquid gold to a fine grain in a cool cupboard, especially in winter. The flavour stays. The aroma often gets clearer.',
      'To soften a set jar, stand it in warm water — not boiling — and stir once it loosens. A microwave is a good way to scorch it, so we skip that.',
      'If a jar smells fermented or foams, write to us. That is a different problem, and we will replace it. Ordinary crystals are the honey telling the truth.',
    ],
  },
  {
    slug: 'packing-a-crate',
    title: 'Packing a crate that travels',
    date: '18 June 2026',
    kicker: 'Gifts',
    image: '/images/mix.jpg',
    excerpt: 'A gift from the mountains should arrive intact, and it should still smell like the lot it came from.',
    paragraphs: [
      'The Summit crate is built in the packing room, not assembled from a warehouse shelf. Almonds, walnuts, dates, and a jar of wildflower honey are weighed for that order.',
      'Glass is wrapped, tins are taped shut, and the gaps are filled with plain paper. We would rather a crate feel snug than look stuffed with plastic.',
      'If you leave a gift note at checkout, it is written on a card and set under the lid. We do not print prices on the packing slip inside a gift.',
      'Inside Pakistan the crate usually leaves Gilgit within two working days. Farther away, we book the slower service unless you ask for express — honey and glass prefer not to be rushed through a hot hold.',
    ],
  },
]

export function getPost(slug) {
  return posts.find((post) => post.slug === slug)
}
