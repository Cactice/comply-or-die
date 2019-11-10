import dynamic from 'next/dynamic'
import React from 'react'
import Router from 'next/router'

const DynamicComponentWithNoSSR = dynamic(
  () => import('../components/player'),
  { ssr: false }
)
const Index = () => (
  <div
    style={{
    backgroundColor: 'black'
  }}>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" />
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
    <DynamicComponentWithNoSSR/>
  </div>
)


export default Index
