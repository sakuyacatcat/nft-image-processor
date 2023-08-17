// pages/_document.tsx
import Document, { Head, Html, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
	return (
	  <Html>
		<Head>
		  <script async src="https://docs.opencv.org/master/opencv.js" onLoad="onOpenCvReady()" />
		</Head>
		<body>
		  <Main />
		  <NextScript />
		</body>
	  </Html>
	)
  }
}

export default MyDocument
