import React from 'react'
import type { NextPage } from 'next'
import ThreejsCanvas from '../components/ThreejsCanvas/ThreejsCanvas'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <main className={styles.main}>
      <ThreejsCanvas />
    </main>
  )
}

export default Home
