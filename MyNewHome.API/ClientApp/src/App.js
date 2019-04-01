import React, { Component } from "react";
import { Route } from "react-router";
import Layout from "./components/Layout";
import Home from "./components/Home";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

// A theme with custom primary and secondary color.
const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#88ffff",
      main: "#4dd0e1",
      dark: "#009faf"
    },
    secondary: {
      light: "#88ffff",
      main: "#4dd0e1",
      dark: "#009faf"
    }
  },
  typography: {
    fontFamily: [
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif"
    ].join(","),
    useNextVariants: true
  }
});

export default class App extends Component {
  static displayName = App.name;

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Layout>
          <Route path="/" component={Home} />
        </Layout>
      </MuiThemeProvider>
    );
  }
}
