import { faker } from '@faker-js/faker';

// ----------------------------------------------------------------------

const POST_TITLES = [
  'Whiteboard Templates By Industry Leaders',
  'Voltaic university',
  'Voltaic Adder Sheet',
  'Voltaic Dealer Rates',
  '✨What is Done is Done ✨',
  'Fresh Prince',
  'Six Socks Studio',
  'vincenzo de cotiis’ crossing over showcases a research on contamination',
  'Simple, Great Looking Animations in Your Project | Video Tutorial',
  '40 Free Serif Fonts for Digital Designers',
  'Examining the Evolution of the Typical Web Design Client',
  'Katie Griffin loves making that homey art',
  'The American Dream retold through mid-century railroad graphics',
  'Voltaic',
  'CarZio-Delivery Driver App SignIn/SignUp',
  'How to create a client-serverless Jamstack app using Netlify, Gatsby and Fauna',
  'Tylko Organise effortlessly -3D & Motion Design',
  'RAYO ?? A expanded visual arts festival identity',
  'Anthony Burrill and Wired mag’s Andrew Diprose discuss how they made January’s Change Everything cover',
  'Inside the Mind of Samuel Day',
  'Portfolio Review: Is This Portfolio Too Creative?',
  'Akkers van Margraten',
  'Gradient Ticket icon',
  'Here’s a Dyson motorcycle concept that doesn’t ‘suck’!',
  'How to Animate a SVG with border-image'
];
const links = [
  "https://www.youtube.com/channel/UCvWp2awdOyhd28f7FQOPGPw",
"https://docs.google.com/spreadsheets/d/1TckEylF3qWgF8VjXzUjKm5KOsSokTVM9tJsySLpBA-w/edit#gid=0",
"https://vccrm.vercel.app/dashboard/rates"];

const posts = [...Array(3)].map((_, index) => ({
  id: faker.datatype.uuid(),
  cover: `/assets/images/covers/cover_${index + 1}.jpg`,
  link: links[index],
  title: POST_TITLES[index + 1],
  createdAt: faker.date.past(),
  view: faker.datatype.number(),
  // comment: faker.datatype.number(),
  // share: faker.datatype.number(),
  // favorite: faker.datatype.number(),
  author: {
    name: faker.name.fullName(),
    avatarUrl: `/assets/images/avatars/avatar_${index + 1}.jpg`
  }
}));

export default posts;
