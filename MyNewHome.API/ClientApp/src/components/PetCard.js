import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import CardMedia from "@material-ui/core/CardMedia";
import Grow from "@material-ui/core/Grow";
import Button from "@material-ui/core/Button";
import * as moment from "moment";

const styles = theme => ({
  chip: {
    margin: "8px 8px 0 0"
  },
  divider: {
    margin: "24px 0"
  },
  card: {
    [theme.breakpoints.down("sm")]: {
      minWidth: "100%",
      maxWidth: "100%"
    },
    [theme.breakpoints.up("md")]: {
      minWidth: 400,
      maxWidth: 400
    },
    minHeight: 400
  },
  buttonBase: {
    width: "100%"
  },
  media: {
    height: 0,
    paddingTop: "75%" // 400:300
  },
  cardActions: {
    padding: "8px 12px 12px 12px"
  }
});

const Type = Object.freeze({
  Dog: 0,
  Cat: 1
});

function getPetTypeName(type) {
  switch (type) {
    case Type.Dog:
      return "kutyus";
    case Type.Cat:
      return "macsek";
    default:
      return "🤷‍";
  }
}

function calculateAge(birthdate) {
  return moment().diff(birthdate, "years");
}

class PetCard extends Component {
  displayName = "PetCard";

  render() {
    const { classes, pet } = this.props;

    return (
      <Grow in>
        <Card className={classes.card}>
          <CardMedia className={classes.media} image={pet.imageUrl} />
          <CardHeader
            title={pet.name}
            subheader={
              getPetTypeName(pet.type) +
              " • " +
              calculateAge(pet.birthdate) +
              " éves"
            }
          />
          <CardActions className={classes.cardActions}>
            <Button
              component={Link}
              to={`mailto:${pet.contactEmail}`}
              size="small"
              color="primary"
            >
              Contact
            </Button>
          </CardActions>
        </Card>
      </Grow>
    );
  }
}

PetCard.propTypes = {
  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  pet: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
};

export default withStyles(styles)(PetCard);
