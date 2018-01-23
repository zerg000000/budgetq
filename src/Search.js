import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Typography from 'material-ui/Typography';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { search } from './actions';
import MeetingTable from './MeetingTable';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import ArrowBack from 'material-ui-icons/ArrowBack';
import SearchIcon from 'material-ui-icons/Search';
import Button from 'material-ui/Button';
import Toolbar from 'material-ui/Toolbar';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';


import Table, {
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
} from 'material-ui/Table';


class Search extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.search = null;
    this.searchWithParams = this.searchWithParams.bind(this);
    this.handleChangePage = this.handleChangePage.bind(this);
  }

   searchWithParams(props=this.props) {
     const { keyword } = props.match.params;
     const { search } = props;
     search(keyword);
   }

   componentDidMount() {
     this.searchWithParams();
   }

   
   componentWillReceiveProps(nextProps) {
     console.log(nextProps);
     console.log('next');
     if (this.props.match.params.keyword !== nextProps.match.params.keyword) {
       this.searchWithParams(nextProps);
     }
   }

   handleChangePage(event, page) {
     const { search } = this.props;
     const { keyword } = this.props.match.params;
     search(keyword, page);
   }
  
  render() {
    const { keyword } = this.props.match.params;
    const { result } = this.props;
    return (
      <div>
        <AppBar position="static" color="default">
          <Toolbar>
            <TextField
              id="search"
              placeholder="關鍵字"
              margin="normal"
              defaultValue={keyword}
              inputRef={input => this.search = input}
              onKeyPress={(ev) => {
                console.log(`Pressed keyCode ${ev.key}`);
                if (ev.key === 'Enter') {
                // Do code here
                  console.log(this.props.history);
                  ev.target.blur();
                  ev.preventDefault();
                  this.props.history.replace('/search/' + ev.target.value);
                }
              }}
              style={{flex: 1}}
              color="contrast"
            />
            <IconButton aria-label="Search" onClick={
              (ev) => {
                ev.preventDefault();
                console.log(this.refs);
                let keyword = this.search.value;
                this.props.history.replace('/search/' + keyword);
              }
            }>
              <SearchIcon />
            </IconButton>
          </Toolbar>
        </AppBar>


        <AppBar position="static" color="accent">
          <Toolbar>
            &nbsp; 關鍵字 " { keyword } " 搜尋結果
          </Toolbar>
        </AppBar>
         {result.meetings &&
          <MeetingTable meetings={result.meetings} offset={result.offset} total={result.total} limit={result.limit} handleChangePage={this.handleChangePage}/>}
        </div>      
    );
  }

}

let mapStateToProps = (state) => {
  return { result: state.search };
}

let mapDispatchToProps = (dispatch) => {
  return { search: (keyword, page) => dispatch(search(keyword, page))};
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);