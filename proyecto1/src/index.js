import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import SequenceList from './Component/Sequence/SequenceList';
import Menu from './Component/Menu/Menu';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { Route } from 'react-router-dom';
import Sequence from './Component/Sequence/Sequence';
import AlineamientoGlobal from './Component/Algorithm/AlineamientoGlobal';
import AlineamientoSemiglobal from './Component/Algorithm/AlineamientoSemiglobal';
import AlineamientoLocal from './Component/Algorithm/AlineamientoLocal';
import MatrixViewer from './Component/MatrixViewer/MatrixViewer';
import TableViewer from './Component/MatrixViewer/TableViewer';

//sequences used on file
const sequences = [];

sequences.push(new Sequence(1,"secuenciaAlice","So she was considering in her own mind (as well as she could, for the day made her feel very sleepy and stupid), whether the pleasure of making a daisy-chain would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.There was nothing so very remarkable in that, nor did Alice think it so very much out of the way to hear the Rabbit say to itself,Oh dear! Oh dear! I shall be too late! But when the Rabbit actually took a watch out of its waistcoat-pocket and looked at it and then hurried on, Alice started to her feet, for it flashed across her mind that she had never before seen a rabbit with either a waistcoat-pocket, or a watch to take out of it, and, burning with curiosity, she ran across the field after it and was just in time to see it pop down a large rabbit-hole, under the hedge. In another moment, down went Alice after it!"));
sequences.push(new Sequence(1,"secuenciaAlice2","So she was considering in her own mind (as well as she could, for the day made her feel very sleepy and stupid), whether the pleasure of making a daisy-chain would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.There was nothing so very remarkable in that, nor did Alice think it so very much out of the way to hear the Rabbit say to itself,Oh dear! Oh dear! I shall be too late! But when the Rabbit actually took a watch out of its waistcoat-pocket and looked at it and then hurried on, Alice started to her feet, for it flashed across her mind that she had never before seen a rabbit with either a waistcoat-pocket, or a watch to take out of it, and, burning with curiosity, she ran across the field after it and was just in time to see it pop down a large rabbit-hole, under the hedge. In another moment, down went Alice after it!"));
sequences.push(new Sequence(2,"secuencia3","ABCDEFGHABCDEFGHABCDEFGHABCDEFGHABCDEFGHABCDEFGHABCDEFGHABCDEFGHABCDEFGHABCDEFGH"));
sequences.push(new Sequence(3,"secuencia3","ABCDABCDEFGHIEFABABCDEFGHICDEFGHIGHIABCDABCDEFGHIEFABABCDEFGHICDEFGHIGHIABCDABCDEFGHIEFABABCDEFGHICDEFGHIGHI"));
sequences.push(new Sequence(4,"secuencia4","ABCDEFGHIJ"));
sequences.push(new Sequence(5,"secuencia5","ABCDEFGHIJK"));
sequences.push(new Sequence(6,"secuencia1","ABCDEFG"));
sequences.push(new Sequence(7,"secuencia2","ABCDEFGH"));
sequences.push(new Sequence(8,"secuencia3","ABCDECCAAGACTTACGCFGI"));
sequences.push(new Sequence(9,"secuencia4","ABCDEFGBCAGACTABCDEFGHHIJ"));
sequences.push(new Sequence(10,"secuencia5","ABCDEFGHIJK"));
sequences.push(new Sequence(11,"secuencia1","ABCDEFG"));
sequences.push(new Sequence(12,"secuencia2","ABCDEFGH"));
sequences.push(new Sequence(13,"secuencia3","ABCDEFGHI"));
sequences.push(new Sequence(14,"secuencia4","ABCDEFGHIJ"));
sequences.push(new Sequence(15,"secuencia5","ABCDEFGHIJK"));
sequences.push(new Sequence(16,"secuencia8","GATPOGATO"));
sequences.push(new Sequence(17,"secuencia9","GAPERROGATO"));




ReactDOM.render(

	<BrowserRouter>

		<NavLink exact to="/createSequence">AddSequence</NavLink>
		<NavLink exact to="/tableViewer">Table Viewer</NavLink>
		<Route exact path="/createSequence" component={() => <Menu sequences = {sequences} />} />
		<Route exact path="/tableViewer" component={() => <TableViewer sequences = {sequences} />} />
		
	</BrowserRouter>


, document.getElementById('root'));

//		<NavLink exact to="/url">Menu item</NavLink>
//		<Route exact path="/url" component={() => <SequenceList sequences = {sequences}/>}/>

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
