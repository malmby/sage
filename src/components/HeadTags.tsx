'use client';

import Head from 'next/head';

export default function HeadTags() {
  return (
    <Head>
      <link
        rel="search"
        type="application/opensearchdescription+xml"
        title="Sage - AI-powered web search"
        href="/opensearch.xml"
      />
    </Head>
  );
}
