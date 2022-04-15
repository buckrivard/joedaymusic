import jsonp from "jsonp";
import PropTypes from 'prop-types';
import styles from './Mailchimp.module.css'


export default function Mailchimp() {
  state = {};

  function handleSubmit(evt) {
    evt.preventDefault();
    const { fields, action } = this.props;
    const values = fields.map(field => {
      return `${field.name}=${encodeURIComponent(this.state[field.name])}`;
    }).join("&");
    const path = `${action}&${values}`;
    const url = path.replace('/post?', '/post-json?');
    // eslint-disable-next-line
    const regex = /^([\w_\.\-\+])+\@([\w\-]+\.)+([\w]{2,10})+$/;
    const email = this.state['EMAIL'];
    (!regex.test(email)) ? this.setState({ status: "empty" }) : this.sendData(url);
  };

  function sendData(url) {
    this.setState({ status: "sending" });
    jsonp(url, { param: "callback" }, (err, data) => {
      if (data.msg.includes("already subscribed")) {
        this.setState({ status: 'duplicate' });
      } else if (err) {
        this.setState({ status: 'error' });
      } else if (data.result !== 'success') {
        this.setState({ status: 'error' });
      } else {
        this.setState({ status: 'success' });
      };
    });
  }

  
  const { fields, styles, className, buttonClassName, type } = this.props;
  const messages = {
    ...Mailchimp.defaultProps.messages,
    ...this.props.messages
  }
  const { status } = this.state;
  return (
    <form onSubmit={this.handleSubmit.bind(this)} className={className}>
      
      {fields.map(input =>
        {if (type === "simple") {
            return (
              <input
                tabIndex="0"
                name={input.name}
                key={input.name}
                placeholder={input.placeholder}
                aria-label={input.placeholder}
                id={input.id}
                onChange={({ target }) => this.setState({ [input.name]: target.value })}
                defaultValue={this.state[input.name]}
                disabled={status === "sending" || status === "success"}
              />
            )
        } else {
          return (
            <div className={styles.emailFormGroup} key={input.name}>
              <label 
                htmlFor={input.id} 
                className={styles.email-form-label}
              >
                  {input.label}
              </label>
              <input
                tabIndex="0"
                name={input.name}
                aria-label={input.placeholder}
                id={input.id}
                onChange={({ target }) => this.setState({ [input.name]: target.value })}
                defaultValue={this.state[input.name]}
                disabled={status === "sending" || status === "success"}
              />
          </div>
          )
        }}
      )}
      <button
        disabled={status === "sending" || status === "success"}
        type="submit"
        className={buttonClassName}
      >
        {messages.button}
      </button>
      <div className={styles.msgAlert}>
        {status === "sending" && <p style={styles.sendingMsg}>{messages.sending}</p>}
        {status === "success" && <p style={styles.successMsg}>{messages.success}</p>}
        {status === "duplicate" && <p style={styles.duplicateMsg}>{messages.duplicate}</p>}
        {status === "empty" && <p style={styles.errorMsg}>{messages.empty}</p>}
        {status === "error" && <p style={styles.errorMsg}>{messages.error}</p>}
      </div>
    </form>
  );
  
}

Mailchimp.defaultProps = {
  messages: {
    sending: "Sending...",
    success: "Thank you for subscribing!",
    error: "An unexpected internal error has occurred.",
    empty: "You must write an e-mail.",
    duplicate: "Too many subscribe attempts for this email address",
    button: "Subscribe!"
  },
  buttonClassName: "",
  styles: {
    sendingMsg: {
      color: "#0652DD"
    },
    successMsg: {
      color: "#009432"
    },
    duplicateMsg: {
      color: "#EE5A24"
    },
    errorMsg: {
      color: "#ED4C67"
    }
  }
};

Mailchimp.propTypes = {
  action: PropTypes.string,
  type: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
  messages: PropTypes.object,
  fields: PropTypes.array,
  styles: PropTypes.object,
  className: PropTypes.string,
  buttonClassName: PropTypes.string
};