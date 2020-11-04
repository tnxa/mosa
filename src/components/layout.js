/**
 * Layout component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React, { useMemo, useEffect } from 'react'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'

import Header from './header'
import './layout.css'
import { createMuiTheme, ThemeProvider, Link } from '@material-ui/core'

const Layout = ({ children }) => {
  const [themePreference, setThemePreference] = React.useState('light')

  useEffect(() => {
    const existingPreference = localStorage.getItem('themePreference')
    if (existingPreference) {
      setThemePreference(existingPreference)
    } else {
      setThemePreference('light')
      localStorage.setItem('themePreference', 'light')
    }
  }, [setThemePreference])

  const theme = useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: themePreference,
        },
      }),
    [themePreference]
  )

  const toggleTheme = () => {
    if (themePreference === 'light') {
      setThemePreference('dark')
      localStorage.setItem('themePreference', 'dark')
    } else {
      setThemePreference('light')
      localStorage.setItem('themePreference', 'light')
    }
  }

  return (
    <StaticQuery
      query={graphql`
        query SiteTitleQuery {
          site {
            siteMetadata {
              title
            }
          }
        }
      `}
      render={data => (
        <ThemeProvider theme={theme}>
          <div style={{ minHeight: '100vh' }}>
            <Header
              siteTitle={data.site.siteMetadata.title}
              themePreference={themePreference}
              toggleTheme={toggleTheme}
            />
            <div
              style={{
                margin: `0 auto`,
                maxWidth: 1280,
                padding: `4.5rem 1.0875rem 1.45rem`,
              }}
            >
              <main>{children}</main>
              <footer style={{ paddingTop: 10 }}>
                © {new Date().getFullYear()}, Built with{` `}
                <Link href="https://www.gatsbyjs.org">Gatsby</Link> and{' '}
                <Link href="http://material-ui.com/">Material UI</Link>. Code
                available on Github @{' '}
                <Link href="https://github.com/tnxa/mosa">tnxa/mosa</Link>
              </footer>
            </div>
          </div>
        </ThemeProvider>
      )}
    />
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
