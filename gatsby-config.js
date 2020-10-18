module.exports = {
  siteMetadata: {
    title: `mosa`,
    description: `web ui for maxsr hardware`,
    author: `tnxa`,
    webSerialKey: `Ansl/FL5lkDc62+KkI02f5IOizKSOOpe2qmYxZS7uAjWzl/UxGyqXY+q0bxxFDB1s1+dt0CZIGu5SEnnlA9MvwgAAABTeyJvcmlnaW4iOiJodHRwczovL3RyeW1vc2EubmV0bGlmeS5hcHA6NDQzIiwiZmVhdHVyZSI6IlNlcmlhbCIsImV4cGlyeSI6MTYwNjYyNjI4MH0=`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `mosa ui`,
        short_name: `mosa`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/logo.png`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: `gatsby-plugin-material-ui`,
      // If you want to use styled components, in conjunction to Material-UI, you should:
      // - Change the injection order
      // - Add the plugin
      options: {
        // stylesProvider: {
        //   injectFirst: true,
        // },
      },
      // 'gatsby-plugin-styled-components',
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    `gatsby-plugin-offline`,
  ],
}
