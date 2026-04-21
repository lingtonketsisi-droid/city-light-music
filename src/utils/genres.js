/**
 * Global Source of Truth for Genres
 * Includes name, slug, and optional metadata
 */
export const GENRES = [
  { name: 'Electronic', slug: 'electronic' },
  { name: 'Hip Hop',    slug: 'hip-hop'    },
  { name: 'R&B',        slug: 'r-and-b'    },
  { name: 'Pop',        slug: 'pop'        },
  { name: 'Amapiano',   slug: 'amapiano'   },
  { name: 'Afrobeat',   slug: 'afrobeat'   },
  { name: 'Jazz',       slug: 'jazz'       },
  { name: 'Classical',  slug: 'classical'  },
  { name: 'Gospel',     slug: 'gospel'     },
  { name: 'Rock',       slug: 'rock'       },
];

export const getGenreBySlug = (slug) => GENRES.find(g => g.slug === slug);
export const getGenreByName = (name) => GENRES.find(g => g.name.toLowerCase() === name.toLowerCase());
