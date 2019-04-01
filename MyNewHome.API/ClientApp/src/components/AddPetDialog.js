import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import CloseIcon from "@material-ui/icons/Close";

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
  dateField: {
    minWidth: 220
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
    file: ""
  };

  componentDidMount() {}

  async handleSave() {
    const payload = {
      name: this.state.name,
      birthdate: this.state.birthdate,
      type: parseInt(this.state.type, 10),
      contactEmail: this.state.contactEmail,
      imageUrl: this.state.imageUrl
    };

    await fetch(`api/pets`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json"
      }
    });

    this.props.handleClose();
  }

  async handleUploadImage(e) {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);

    const response = await fetch(`api/pets/upload`, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json"
      }
    });

    const result = await response.json();
    console.log(result);

    this.setState({ imageUrl: result.url });

    if (result.probability > 0.5) {
      let type = "";
      switch (result.type) {
        case "dog":
          type = "0";
          break;
        case "cat":
          type = "1";
          break;
        default:
          break;
      }

      this.setState({ type: type });
    }
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
  };

  preventDefault = event => {
    event.preventDefault();
  };

  render() {
    const { imageUrl, name, type, contactEmail } = this.state;
    const { open, fullScreen, classes } = this.props;

    return (
      <Dialog open={open} onClose={this.handleClose} fullScreen={fullScreen}>
        <DialogContent className={classes.details}>
          <div className={classes.closeButton}>
            <IconButton onClick={this.handleClose} aria-label="Close">
              <CloseIcon />
            </IconButton>
          </div>
          {!imageUrl ? (
            <>
              <h1>File Upload</h1>
              <input
                accept="image/*"
                className={classes.input}
                id="upload"
                type="file"
                onChange={e => this.handleUploadImage(e)}
              />
              <label htmlFor="upload">
                <Button variant="contained" component="span">
                  Upload
                </Button>
              </label>
            </>
          ) : (
            <div>
              <div className={classes.formControl}>
                <InputLabel htmlFor="type">Type</InputLabel>
                <Select
                  required
                  value={type}
                  onChange={this.handleTypeChange}
                  inputProps={{
                    name: "type",
                    id: "type"
                  }}
                >
                  <MenuItem value="0">Dog</MenuItem>
                  <MenuItem value="1">Cat</MenuItem>
                </Select>
              </div>
              <div className={classes.formControl}>
                <TextField
                  id="name"
                  label="Name"
                  value={name}
                  className={classes.textField}
                  margin="normal"
                  onChange={this.handleNameChange}
                />
              </div>
              <div className={classes.formControl}>
                <TextField
                  id="birthDate"
                  label="Birthdate"
                  type="date"
                  InputLabelProps={{
                    shrink: true
                  }}
                  onChange={this.handleBirthdateChange}
                  className={classes.dateField}
                />
              </div>
              <div className={classes.formControl}>
                <TextField
                  id="contactEmail"
                  label="Contact Email"
                  value={contactEmail}
                  className={classes.textField}
                  margin="normal"
                  onChange={this.handleContactEmailChange}
                />
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions className={classes.actions}>
          <Button onClick={() => this.handleSave()}>Save</Button>
        </DialogActions>
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
