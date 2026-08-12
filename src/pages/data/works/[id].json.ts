import type { APIRoute } from 'astro';
import { archiveItems, type ArchiveItem } from '../../../content/archive';

export function getStaticPaths() {
  return archiveItems.map((item) => ({
    params: { id: item.id },
    props: { item },
  }));
}

export const GET: APIRoute = ({ props }) => {
  const item = props.item as ArchiveItem;

  return new Response(JSON.stringify(item), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
};
