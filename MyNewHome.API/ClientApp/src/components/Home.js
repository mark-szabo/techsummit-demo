import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import PetCard from "./PetCard";

const styles = theme => ({
  card: {
    [theme.breakpoints.down("sm")]: {
      minWidth: "100%",
      maxWidth: "100%"
    },
    [theme.breakpoints.up("md")]: {
      minWidth: "inherit",
      maxWidth: "inherit"
    }
  },
  grid: {
    maxHeight: "calc(100% + 48px)",
    width: "calc(100% + 48px)",
    margin: "-24px",
    padding: "8px",
    overflow: "auto",
    justifyContent: "center"
  },
  readyText: {
    marginLeft: "58px"
  }
});

class Home extends Component {
  static displayName = Home.name;

  state = {
    pets: [],
    loading: true
  };

  async componentDidMount() {
    document.getElementsByTagName("main")[0].style.overflow = "hidden";

    const response = await fetch("api/pets");
    this.setState({ pets: await response.json(), loading: false });
  }

  componentWillUnmount() {
    document.getElementsByTagName("main")[0].style.overflow = "auto";
  }

  render() {
    const { classes } = this.props;
    const { pets } = this.state;

    return (
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
        spacing={16}
        className={classes.grid}
      >
        {pets.map(pet => (
          <Grid item key={pet.id} className={classes.card}>
            <PetCard pet={pet} />
          </Grid>
        ))}
      </Grid>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
};

export default withStyles(styles)(Home);
