import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import Heading from '@theme/Heading';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/introduction">
            Get Started 🚀
          </Link>
        </div>
        <p className="badges">
          <a href="https://www.npmjs.com/package/react-native-integrate" target="_blank" rel="noopener noreferrer"><img decoding="async" loading="lazy" src="https://img.shields.io/npm/v/react-native-integrate" alt="npm package" /></a>
          <a href="https://github.comreact-native-integrate/integrate/actions/workflows/release.yml" target="_blank" rel="noopener noreferrer"><img decoding="async" loading="lazy" src="https://github.com/react-native-integrate/integrate/actions/workflows/release.yml/badge.svg" alt="Build Status" /></a>
          <a href="https://www.npmtrends.com/react-native-integrate" target="_blank" rel="noopener noreferrer"><img decoding="async" loading="lazy" src="https://img.shields.io/npm/dt/react-native-integrate" alt="Downloads" /></a>
          <a href="https://github.com/react-native-integrate/integrate/issues" target="_blank" rel="noopener noreferrer"><img decoding="async" loading="lazy" src="https://img.shields.io/github/issues/react-native-integrate/integrate" alt="Issues" /></a>
          <a href="https://codecov.io/gh/react-native-integrate/integrate" target="_blank" rel="noopener noreferrer"><img decoding="async" loading="lazy" src="https://codecov.io/gh/react-native-integrate/integrate/branch/main/graph/badge.svg" alt="Code Coverage" /></a>
          <a href="http://commitizen.github.io/cz-cli/" target="_blank" rel="noopener noreferrer"><img decoding="async" loading="lazy" src="https://img.shields.io/badge/commitizen-friendly-brightgreen.svg" alt="Commitizen Friendly" /></a>
          <a href="https://github.com/semantic-release/semantic-release" target="_blank" rel="noopener noreferrer"><img decoding="async" loading="lazy" src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg" alt="Semantic Release" /></a>
        </p>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="React Native Integrate">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
