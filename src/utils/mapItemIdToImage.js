import antistress from '../assets/images/shop/antistress.webp';
import backpack from '../assets/images/shop/backpack.webp';
import beltbag from '../assets/images/shop/beltbag.webp';
import book1 from '../assets/images/shop/book1.webp';
import book2 from '../assets/images/shop/book2.webp';
import book3 from '../assets/images/shop/book3.webp';
import bottle from '../assets/images/shop/bottle.webp';
import camera from '../assets/images/shop/camera.webp';
import cardholder from '../assets/images/shop/cardholder.webp';
import case1 from '../assets/images/shop/case.webp';
import certificate1 from '../assets/images/shop/certificate1.webp';
import certificate2 from '../assets/images/shop/certificate2.webp';
import certificate3 from '../assets/images/shop/certificate3.webp';
import certificate4 from '../assets/images/shop/certificate4.webp';
import certificate5 from '../assets/images/shop/certificate5.webp';
import chocolate from '../assets/images/shop/chocolate.webp';
import consultation from '../assets/images/shop/consultation.webp';
import course from '../assets/images/shop/course.webp';
import cover from '../assets/images/shop/cover.webp';
import drips from '../assets/images/shop/drips.webp';
import mousepad from '../assets/images/shop/mousepad.webp';
import notebook from '../assets/images/shop/notebook.webp';
import pass from '../assets/images/shop/pass.webp';
import pillow from '../assets/images/shop/pillow.webp';
import planner from '../assets/images/shop/planner.webp';
import printer from '../assets/images/shop/printer.webp';
import projector from '../assets/images/shop/projector.webp';
import shopper from '../assets/images/shop/shopper.webp';
import stand from '../assets/images/shop/stand.webp';
import thermos from '../assets/images/shop/thermos.webp';
import ticket from '../assets/images/shop/ticket.webp';
import tshirt from '../assets/images/shop/tshirt.webp';

export function mapIdToImage(id) {
  const map = {
    1: shopper,
    2: chocolate,
    3: book1,
    4: antistress,
    5: cover,
    6: bottle,
    7: certificate1,
    8: cardholder,
    9: notebook,
    10: book2,
    11: case1,
    12: stand,
    13: planner,
    14: tshirt,
    15: book3,
    16: mousepad,
    17: thermos,
    18: certificate2,
    19: beltbag,
    20: drips,
    21: course,
    22: printer,
    23: backpack,
    24: certificate3,
    25: pass,
    26: camera,
    27: projector,
    28: certificate4,
    29: pillow,
    30: consultation,
    31: certificate5,
    32: ticket
  };
  return map[id] || null;
}