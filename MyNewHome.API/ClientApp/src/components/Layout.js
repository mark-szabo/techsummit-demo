import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";

const styles = theme => ({
  root: {
    width: "100%"
  },
  text: {
    paddingTop: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
    color: theme.palette.primary.main
  },
  paper: {
    display: "flex",
    height: 128,
    justifyContent: "center",
    backgroundColor: theme.palette.background.default,
    color: theme.palette.primary.main,
    padding: 24,
    boxShadow: "none"
  },
  toolbar: {
    maxWidth: 256
  },
  content: {
    flexGrow: 1,
    overflow: "auto",
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3
  },
  appTitle: {
    height: 80,
    width: 80,
    margin: "0 24px"
  },
  link: {
    textDecoration: "underline",
    color: "rgba(0, 0, 0, 0.54)",
    fontSize: "0.8125rem",
    fontWeight: 400
  }
});

class Layout extends Component {
  static displayName = Layout.name;

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <CssBaseline />
        <Paper square className={classes.paper}>
          <img
            src={"/images/logo192.png"}
            alt="logo"
            height="80px"
            className={classes.appTitle}
          />
          <Typography className={classes.text} variant="h2">
            Új gazdit!
          </Typography>
        </Paper>

        <main className={classes.content}>{this.props.children}</main>
      </div>
    );
  }
}

Layout.propTypes = {
  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  theme: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  location: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  user: PropTypes.object // eslint-disable-line react/forbid-prop-types
};

export default withStyles(styles, { withTheme: true })(Layout);
