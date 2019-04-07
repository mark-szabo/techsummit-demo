import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import Select from "@material-ui/core/Select";
import CloseIcon from "@material-ui/icons/Close";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import green from "@material-ui/core/colors/green";
import Spinner from "./Spinner";

const styles = theme => ({
  input: {
    display: "none"
  },
  details: {
    [theme.breakpoints.down("sm")]: {
      minWidth: "100%",
      maxWidth: "100%"
    },
    [theme.breakpoints.up("md")]: {
      minWidth: 600,
      maxWidth: 600
    }
  },
  button: {
    margin: theme.spacing.unit,
    position: "absolute",
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2
  },
  closeButton: {
    margin: theme.spacing.unit,
    position: "absolute",
    top: 0,
    right: 0
  },
  actions: {
    justifyContent: "initial",
    height: 36
  },
  formControl: {
    marginRight: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    [theme.breakpoints.down("sm")]: {
      width: "100%"
    },
    [theme.breakpoints.up("md")]: {
      width: 220
    }
  },
  inputField: {
    [theme.breakpoints.down("sm")]: {
      width: "100%"
    },
    [theme.breakpoints.up("md")]: {
      width: 220
    }
  },
  uploadButton: {
    marginTop: 24
  },
  snackbar: {
    backgroundColor: green[600],
    minWidth: 200,
    maxWidth: 300,
    marginBottom: theme.spacing.unit * 3
  },
  message: {
    display: "flex",
    alignItems: "center"
  },
  emoji: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  center: {
    display: "grid",
    placeItems: "center",
    textAlign: "center",
    height: "80%"
  },
  errorIcon: {
    margin: theme.spacing.unit,
    color: "#BDBDBD",
    width: "100px",
    height: "100px"
  },
  errorText: {
    color: "#9E9E9E"
  }
});

class AddPetDialog extends React.Component {
  displayName = "AddPetDialog";

  state = {
    imageUrl: "",
    name: "",
    birthdate: "",
    contactEmail: "",
    type: "0",
    file: "",
    loading: false,
    predictionMessage: "",
    error: false
  };

  componentDidMount() {}

  async handleSave() {
    this.handleLoading(true);

    const payload = {
      name: this.state.name,
      birthdate: this.state.birthdate,
      type: parseInt(this.state.type, 10),
      contactEmail: this.state.contactEmail,
      imageUrl: this.state.imageUrl
    };

    try {
      await fetch(`api/pets`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.log(error);
    }

    this.handleClose();
    this.handleLoading(false);
  }

  async handleUploadImage(e) {
    this.handleLoading(true);

    const formData = new FormData();
    formData.append("image", e.target.files[0]);

    try {
      const response = await fetch(`api/pets/upload`, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json"
        }
      });

      if (!response.ok) this.setState({ error: true });
      else {
        const result = await response.json();
        console.log(result);

        this.setState({ imageUrl: result.url });

        if (result.probability > 0.5) {
          let type = "";
          let predictionMessage = "";
          switch (result.type) {
            case "dog":
              type = "0";
              predictionMessage = "Látom! Ez egy kutyus! 🐶";
              break;
            case "cat":
              type = "1";
              predictionMessage = "Látom! Ez egy cica! 🐱";
              break;
            default:
              break;
          }

          this.setState({ type: type, predictionMessage: predictionMessage });
        }
      }
    } catch (error) {
      console.log(error);
    }

    this.handleLoading(false);
  }

  handleLoading(on) {
    this.setState({
      loading: on
    });
  }

  handleTypeChange = event => {
    this.setState({
      type: event.target.value
    });
  };

  handleNameChange = event => {
    this.setState({
      name: event.target.value
    });
  };

  handleContactEmailChange = event => {
    this.setState({
      contactEmail: event.target.value
    });
  };

  handleBirthdateChange = event => {
    this.setState({
      birthdate: event.target.value
    });
  };

  handleClose = () => {
    this.props.handleClose();
    this.setState({
      imageUrl: "",
      name: "",
      birthdate: "",
      contactEmail: "",
      type: "0",
      file: "",
      loading: false,
      predictionMessage: "",
      error: false
    });
  };

  preventDefault = event => {
    event.preventDefault();
  };

  render() {
    const {
      imageUrl,
      name,
      type,
      contactEmail,
      predictionMessage,
      loading,
      error
    } = this.state;
    const { open, fullScreen, classes } = this.props;

    return (
      <Dialog open={open} onClose={this.handleClose} fullScreen={fullScreen}>
        <DialogContent className={classes.details}>
          <div className={classes.closeButton}>
            <IconButton onClick={this.handleClose} aria-label="Close">
              <CloseIcon />
            </IconButton>
          </div>
          {loading ? (
            <Spinner />
          ) : error ? (
            <div className={classes.center}>
              <div>
                <ErrorOutlineIcon className={classes.errorIcon} />
                <Typography
                  variant="h6"
                  gutterBottom
                  className={classes.errorText}
                >
                  Hiba történt
                  <span
                    role="img"
                    aria-label="sad face emoji"
                    className={classes.emoji}
                  >
                    😫
                  </span>
                </Typography>
              </div>
            </div>
          ) : !imageUrl ? (
            <>
              <Typography variant="h3" gutterBottom>
                Tölts fel egy fotót!
              </Typography>
              <input
                accept="image/*"
                className={classes.input}
                id="upload"
                type="file"
                onChange={e => this.handleUploadImage(e)}
              />
              <label htmlFor="upload">
                <Button
                  variant="contained"
                  color="primary"
                  component="span"
                  className={classes.uploadButton}
                >
                  Feltöltés
                </Button>
              </label>
            </>
          ) : (
            <>
              {predictionMessage && (
                <SnackbarContent
                  className={classes.snackbar}
                  aria-describedby="client-snackbar"
                  message={
                    <span id="client-snackbar" className={classes.message}>
                      {predictionMessage}
                    </span>
                  }
                />
              )}
              <div className={classes.formControl}>
                <div>
                  <InputLabel htmlFor="type">Típus</InputLabel>
                </div>
                <Select
                  required
                  value={type}
                  onChange={this.handleTypeChange}
                  className={classes.inputField}
                  inputProps={{
                    name: "type",
                    id: "type"
                  }}
                >
                  <MenuItem value="0">
                    <span
                      role="img"
                      aria-label="dog emoji"
                      className={classes.emoji}
                    >
                      🐶
                    </span>
                    Kutyus
                  </MenuItem>
                  <MenuItem value="1">
                    <span
                      role="img"
                      aria-label="cat emoji"
                      className={classes.emoji}
                    >
                      🐱
                    </span>
                    Macsek
                  </MenuItem>
                </Select>
              </div>
              <div className={classes.formControl}>
                <TextField
                  id="name"
                  label="Név"
                  value={name}
                  className={classes.inputField}
                  margin="normal"
                  onChange={this.handleNameChange}
                />
              </div>
              <div className={classes.formControl}>
                <TextField
                  id="birthDate"
                  label="Születési dátum"
                  type="date"
                  InputLabelProps={{
                    shrink: true
                  }}
                  onChange={this.handleBirthdateChange}
                  className={classes.inputField}
                />
              </div>
              <div className={classes.formControl}>
                <TextField
                  id="contactEmail"
                  label="Email"
                  value={contactEmail}
                  className={classes.inputField}
                  margin="normal"
                  onChange={this.handleContactEmailChange}
                />
                <Typography variant="caption" gutterBottom>
                  Demó app. Ne adj meg valós email címet!
                </Typography>
              </div>
              <Button
                variant="contained"
                color="primary"
                onClick={() => this.handleSave()}
              >
                Kész!
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    );
  }
}

AddPetDialog.propTypes = {
  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
};

export default withStyles(styles)(withMobileDialog()(AddPetDialog));
