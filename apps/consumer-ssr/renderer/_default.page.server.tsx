export { render }
// See https://vite-plugin-ssr.com/data-fetching
export const passToClient = ['pageProps', 'urlPathname']

import ReactDOMServer from 'react-dom/server'
import { PageShell } from './PageShell'
import { escapeInject, dangerouslySkipEscape } from 'vite-plugin-ssr/server'
import logoUrl from './logo.png'
import type { PageContextServer } from './types'

async function render(pageContext: PageContextServer) {
  const { Page, pageProps } = pageContext
  // This render() hook only supports SSR, see https://vite-plugin-ssr.com/render-modes for how to modify render() to support SPA
  if (!Page) throw new Error('My render() hook expects pageContext.Page to be defined')
  const pageHtml = ReactDOMServer.renderToString(
    <PageShell pageContext={pageContext}>
      <Page {...pageProps} />
    </PageShell>
  )

  // See https://vite-plugin-ssr.com/head
  const { documentProps } = pageContext.exports
  const title = (pageContext?.pageProps?.title as string)
  const desc = (documentProps && documentProps.description) || 'MG Gadgets - Buy & Sell Phones at Best Price'

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="${logoUrl}" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
        <meta name="description" content="${desc}" />
        <meta name="theme-color" content="#000000" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css">
        <title>${title}</title>
      </head>
      <body>
        <div id="react-root">${dangerouslySkipEscape(pageHtml)}</div>

        
  <script>
    window.onload = () => {

    

      window.onscroll = function() {
        myFunction()
      };
      var header = document.getElementById("sticky-header");
      var sticky = header.offsetHeight;
      function myFunction() {
        

        if (window.scrollY > sticky) {
          document.getElementById("sticky-header").classList.add('sticky');
          document.querySelector("body").style.paddingTop="73px";
        } else {
          console.log("removing sticky");
          document.getElementById("sticky-header").classList.remove('sticky');
          document.querySelector("body").style.paddingTop="0px";
        }

      }


      var scrollNextButtons = document.querySelectorAll(".fa-angle-right");
      var scrollPrevButtons = document.querySelectorAll(".fa-angle-left");

      scrollPrevButtons.forEach(spreButton => {

        spreButton.addEventListener("click", (e) => {
          var containerId = spreButton.getAttribute("data-controller");
          var itemContainer = document.querySelector("[data-item-container='" + containerId + "']");
          itemContainer.scrollBy(-290, 0);
          if (itemContainer.scrollLeft < 100) {
            itemContainer.scrollTo(0, 0);
          }
        });

      })

      scrollNextButtons.forEach(snxButton => {
        snxButton.addEventListener("click", (e) => {
          var containerId = snxButton.getAttribute("data-controller");
          var itemContainer = snxButton.nextElementSibling;

          console.log(itemContainer);
          itemContainer.scrollBy(290, 0);

        })
      });


      var itemContainers = document.querySelectorAll("[data-item-container]");
      Array.prototype.slice.call(itemContainers).forEach(container => {
        container.addEventListener("scroll", (e) => {
          var containerId = container.getAttribute("data-item-container");
          var prevBtn = document.querySelector("[data-controller='" + containerId + "']");
          if (container.scrollLeft > 0) {
            prevBtn.style.display = "block";
          } else {
            prevBtn.style.display = "none";
          }

        })
      })

      var year = document.querySelector("#year");
      var y = new Date().getFullYear();
      year.innerText = y;


    

    }
  </script>
      </body>
    </html>`

  return {
    documentHtml,
    pageContext: {
      // We can add some `pageContext` here, which is useful if we want to do page redirection https://vite-plugin-ssr.com/page-redirection
    }
  }
}
