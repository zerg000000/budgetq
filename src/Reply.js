import React, { Component } from 'react';
import { connect } from 'react-redux';
import Tabs, { Tab } from 'material-ui/Tabs';
import AppBar from 'material-ui/AppBar';
import Button from 'material-ui/Button';
import Toolbar from 'material-ui/Toolbar';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import Chip from 'material-ui/Chip';
import Disqus from './Disqus';
import { loadReply } from './actions';


class Reply extends Component {
  static handleClick(evt) {
    window.location = `/search/${evt.target.innerText}`;
  }

  constructor(props) {
    super(props);
    this.renderTable = this.renderTable.bind(this);
    this.renderTab = this.renderTab.bind(this);
    this.changeTab = this.changeTab.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
    this.state = { value: 0 };
  }

  componentDidMount() {
    const { loadReplyAction, match, replyKey: attr } = this.props;
    const { replyKey: param } = match.params;
    const key = attr || param;
    loadReplyAction(key);
  }

  changeTab(evt, value) {
    this.setState({ value });
  }

  renderHeader() {
    const { reply } = this.props;
    const url = `https://api.g0vhk.io/budget/sharer/${reply.key}`;
    return (
      <AppBar position="static" color="secondary">
        <Toolbar>
          { reply.key } - { reply.member }
          &nbsp;&nbsp;
          <Button 
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
            target="_blank"
            variant="raised" >
            分享
          </Button>
          &nbsp;&nbsp;
          <Button
            href={`https://docs.google.com/forms/d/e/1FAIpQLScn_SK7wtVYHstXJR324vFpe8sFQy8-eSofq8vKpTOAlcvazw/viewform?entry.604171204=${reply.key}&entry.616437323`}
            target="_blank"
            variant="raised"
          >
            報告問題
          </Button>
        </Toolbar>
      </AppBar>
    );
  }

  renderTab() {
    const { reply } = this.props;
    return (
      <div>
        <AppBar position="static">
          <Tabs value={this.state.value} onChange={this.changeTab} fullWidth>
            <Tab label="問題" />
            <Tab label="回覆" />
          </Tabs>
        </AppBar>
        { this.state.value === 0 && <div dangerouslySetInnerHTML={{ __html: reply.question }} /> }
        { this.state.value === 1 && <div dangerouslySetInnerHTML={{ __html: reply.answer }} /> }
      </div>
    );
  }


  renderTable() {
    const { reply } = this.props;
    return (
      <table>
        <tbody>
          <tr>
            <td>年份:</td><td>{ reply.year }</td>
          </tr>
          <tr>
            <td>部門:</td><td>{ reply.bureau }</td>
          </tr>
          <tr>
            <td>總目:</td><td>{ reply.head }</td>
          </tr>
          <tr>
            <td>分目:</td><td>{ reply.sub_head }</td>
          </tr>
          <tr>
            <td>綱領:</td><td>{ reply.programme }</td>
          </tr>
          <tr>
            <td>管制人員:</td>
            <td>
              { reply.controlling_officer_title }
              { reply.controlling_officer_name }
            </td>
          </tr>
          <tr>
            <td>局長:</td><td>{ reply.director }</td>
          </tr>
          <tr>
            <td>提問人:</td><td>{ reply.member }</td>
          </tr>
          <tr>
            <td>關鍵字:</td>
            <td>
              { reply.keywords.map(k => (
                <span>
                  <Chip label={k} onClick={Reply.handleClick} />
                   &nbsp;&nbsp;
                </span>))}
            </td>
          </tr>
          <tr>
            <td><br /></td>
            <td />
          </tr>
        </tbody>
      </table>
    );
  }

  render() {
    const { reply, loading, key } = this.props;
    if (reply) {
      const url = `http://budgetq.g0vhk.io/reply/${reply.key}`;
      const title = `${reply.year}年開支預算問題${reply.head}-${reply.member}`;
      const description = reply.question.replace('/(<([^>]+)>)/ig', '').substring(0, 40);
      return (
        <div>
          <Helmet>
            <meta charSet="utf-8" />
            <title>{title}</title>
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
          </Helmet>
          {this.renderHeader()}
          {this.renderTable()}
          {this.renderTab()}
          <Disqus shortname="budgetq-g0vhk-io" url={url} />
        </div>
      );
    }
    return (
      <div>
        { !loading && <span>載入{ key } 發生錯誤 - 404錯誤</span> }
      </div>
    );
  }
}


const mapStateToProps = state => ({ reply: state.reply.data, loading: state.reply.loading });

const mapDispatchToProps = dispatch =>
  ({ loadReplyAction: key => dispatch(loadReply(key)) });

Reply.propTypes = {
  loadReplyAction: PropTypes.func,
  match: PropTypes.object,
  replyKey: PropTypes.string,
  reply: PropTypes.string,
  key: PropTypes.string,
  loading: PropTypes.bool,
};


Reply.defaultProps = {
  loading: null,
  loadReplyAction: null,
  match: null,
  reply: null,
  replyKey: null,
  key: null,
};

export default connect(mapStateToProps, mapDispatchToProps)(Reply);
