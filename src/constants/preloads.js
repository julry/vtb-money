import introreg from '../assets/images/introreg.webp';
import persStart from '../assets/images/person/persStart.webp';
import female from '../assets/images/person/persStartF.webp';
import arrow from '../assets/images/arrowLeft.webp';
import waiting from '../assets/images/waiting.webp';
import coinImg from '../assets/images/coinImg.webp'; 

import money from '../assets/images/money.webp';
import edu from '../assets/images/edu.webp';
import cart from '../assets/images/cart.webp';
import luck from '../assets/images/luck.webp';
import play from '../assets/images/play.webp';
import arrowRight from '../assets/images/arrowRight.webp';
import field from '../assets/images/onboardingField.webp';
import profile from '../assets/images/profile.webp';
import rules from '../assets/images/rules.webp';
import shop from '../assets/images/shop.webp';
import games from '../assets/images/games.webp';

import gameoct1 from '../assets/images/lobby/game-oct1.webp';
import gameoct2 from '../assets/images/lobby/game-oct2.webp';
import gamerect from '../assets/images/lobby/gamerect.webp';
import investoct1 from '../assets/images/lobby/invest-oct1.webp';
import investoct2 from '../assets/images/lobby/invest-oct2.webp';
import investrect from '../assets/images/lobby/investrect.webp';
import quizoct1 from '../assets/images/lobby/quiz-oct1.webp';
import quizrect from '../assets/images/lobby/quizrect.webp';
import luckrect from '../assets/images/lobby/luckrect.webp';
import moneyrect from '../assets/images/lobby/moneyrect.webp';
import startTile from '../assets/images/lobby/startTile.webp';
import avatar from '../assets/images/person/persProfile.webp';
import avatarF from '../assets/images/person/persProfileF.webp';

import juice from '../assets/images/lobby/juice.webp';

import depos from '../assets/images/lobby/invest_depos.webp';
import shares from '../assets/images/lobby/invest_shares.webp';
import book from '../assets/images/lobby/invest_book.webp';
import cycle from '../assets/images/lobby/invest_cycle.webp';
import course from '../assets/images/lobby/invest_course.webp';
import obligation from '../assets/images/lobby/invest_obligation.webp';
import ticket from '../assets/images/lobby/invest_ticket.webp';
import sport from '../assets/images/lobby/invest_sport.webp';
import luckModal from '../assets/images/luckModal.webp'; 
import minigamecell from '../assets/images/minigamecell.webp'; 

import emptyitem from '../assets/images/emptyitem.webp';
import emptyshop from '../assets/images/emptyshop.webp';

import collectEffect from '../assets/images/runner/collectEffect.webp';

import characterSrc from '../assets/images/person/persStandLobby.webp';
import characterFSrc from '../assets/images/person/persFStandLobby.webp';
import characterInvest from '../assets/images/person/persInvest.webp';
import characterFInvest from '../assets/images/person/persFInvest.webp';
import characterGame from '../assets/images/person/persGame.webp';
import characterFGame from '../assets/images/person/persFGame.webp';
import characterQuiz from '../assets/images/person/persQuiz.webp';
import characterFQuiz from '../assets/images/person/persFQuiz.webp';
import characterLuck from '../assets/images/person/persLuck.webp';
import characterFLuck from '../assets/images/person/persFLuck.webp';
import characterBonus from '../assets/images/person/persBonus.webp';
import characterFBonus from '../assets/images/person/persFBonus.webp';

import start2048Img from '../assets/images/2048/startImg.webp';
import startCrossImg from '../assets/images/cross/startImg.webp';
import startCatchImg from '../assets/images/doodle/startImg.webp';
import startMatchImg from '../assets/images/match/startImg.webp';
import startRunnerImg from '../assets/images/runner/startImg.webp';
import persJump from '../assets/images/person/persJump.webp';
import persFJump from '../assets/images/person/persFJump.webp';


const introImages = [introreg, persStart, female, arrow];
const introImagesWaiting = [...introImages, waiting];

const lobbyImages = [
    coinImg, gameoct1, gameoct2, gamerect, investoct1, investoct2, investrect,
    quizoct1, quizrect, luckrect, moneyrect, startTile, luckModal, minigamecell,
    collectEffect, 
];

const gamesImages = [
    start2048Img, startCrossImg, startCatchImg, startMatchImg, 
    startRunnerImg
]

const lobbyImagesF = [
    ...lobbyImages, avatarF, characterFSrc, persFJump, characterFInvest, characterFGame, characterFQuiz,
    characterFLuck,characterFBonus, ...gamesImages
]

const lobbyImagesM = [
    ...lobbyImages, avatar, characterSrc, persJump, characterInvest, characterGame, characterQuiz,
    characterLuck, characterBonus, ...gamesImages
]

const shopModalImages = [
    depos, collectEffect, emptyshop, emptyitem
]

const week1Images = [
    juice, depos, shares, book, cycle, course, obligation, ticket, sport
];

const firstLobbyImages = [
    money, edu, cart, luck, play, arrowRight, field, profile, 
    rules, shop, games, ...lobbyImages, ...week1Images
];

const week2Images = [];
const week3Images = [];
const week4Images = [];

const WEEK_TO_IMAGES = {
    1: week1Images,
    2: week2Images,
    3: week3Images,
    4: week4Images,
}

export { introImages, introImagesWaiting, firstLobbyImages, lobbyImages, shopModalImages, week1Images, lobbyImagesF, lobbyImagesM, WEEK_TO_IMAGES };