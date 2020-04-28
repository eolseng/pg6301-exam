// Simulated in-memory database of cards

const cards = new Map();

let idCounter = 0;
    
class Card {
    constructor(name, latinName, painLevel, description, value) {
        this.id = idCounter++;
        this.name = name;
        this.latinName = latinName;
        this.painLevel = painLevel;
        this.description = description;
        this.value = value;
    }
}

function getCard(cardId) {
    return cards.get(cardId);
}

function getRandomCard() {
    const rnd = Math.floor(Math.random() * cards.size);
    return getCard(rnd);
}

function getRandomCards(amount) {
    const cards = [];
    // You can receive the same card multiple times.
    for (let i = 0; i < amount; i++) {
        cards.push(getRandomCard());
    }
    return cards;
}

function getAllCards() {
    return cards;
}


function createCard(name, latinName, painLevel, description, value) {
    const card = new Card(name, latinName, painLevel, description, value);
    cards.set(card.id, card);
    return card;
}

createCard(
    "Honey Wasp",
    "Brachygastra mellifica",
    2.0,
    "Spicy, blistering. A cotton swap dipped in habanero sauce has been pushed up your nose.",
    200
);

createCard(
    "Baldfaced Hornet",
    "Dolichovespula maculata",
    2.0,
    "Rich, hearty, slightly crunchy. Similar to getting your hand mashed in a revolving door.",
    200
);

createCard(
    "Indian Jumping Ant",
    "Harpegnathos saltator",
    1.0,
    "Ah, that wonderful wake-up feeling, like coffee but oh so bitter.",
    100
);

createCard(
    "Water-Walking Wasp",
    "Euodynerus crypticus",
    1.0,
    "Clever but trivial? A little like magic in that you cannot quite figure out the difference between pain and illusion.",
    100
);

createCard(
    "Ferocious Polybia Wasp",
    "Polybia rejecta",
    1.5,
    "Like a trick gone wrong. Your posterior is a target for a BB gun. Bull's-eye, over and over.",
    150
);

createCard(
    "Suturing Army Ant",
    "Eciton burchellii",
    1.5,
    "A cut on your elbow, stitched with a rusty needle.",
    150
);

createCard(
    "Iridescent Cockroach Hunter",
    "Chlorion cyaneum",
    1.0,
    "Itchy with a hint of sharpness. A single stinging nettle pricked your hand.",
    100
);

createCard(
    "Asian Needle Ant",
    "Brachyponera chinensis",
    1.0,
    "Nightfall following a day at the beach. You forgot the sunscreen. Your burned nose lets you know.",
    100
);

createCard(
    "Yellow Fire Wasp",
    "Agelaia myrmecophila",
    2.5,
    "An odd, distressing pain. Tiny blowtorches kiss your arms and legs.",
    250
);

createCard(
    "Red-Headed Paper Wasp",
    "Polistes erythrocephalus",
    3.0,
    "Immediate, irrationally intense, and unrelenting. This is the closest you will come to seeing the blue of a flame from within the fire.",
    300
);

createCard(
    "Nocturnal Hornet",
    "Probespa sp.",
    2.5,
    "Rude, insulting. An ember from your campfire glued to your forearm.",
    250
);

createCard(
    "Florida Harvester Ant",
    "Pogonomyrmex badius",
    3.0,
    "Bold and unrelenting. Somebody is using a power drill to excavate your ingrown toenail.",
    300
);

createCard(
    "Velvet Ant",
    "Dasymutilla klugii",
    3.0,
    "Explosive and long lasting, you sound insane as you scream. Hot oil from the deep fryer spilling all over your entire hand.",
    300
);

createCard(
    "Tarantula Hawk",
    "Pepsis spp.",
    4.0,
    "Blinding, fierce, shockingly electric. A running hair dryer has been dropped into your bubble bath. A bolt out of the heavens. Lie down and scream.",
    500
);

createCard(
    "Bullet Ant",
    "Paraponera clavata",
    4.0,
    "Pure, intense, brilliant pain. Like walking over flaming charcoal with a 3-inch nail embedded in your heel.",
    500
);

createCard(
    "Warrior Warp",
    "Synoeca septentrionalis",
    4.0,
    "Torture. You are chained in the flow of an active volcano. Why did I start this list?",
    500
);

createCard(
    "Western Honey Bee",
    "Apis mellifera",
    2.0,
    "Burning, corrosive, but you can handle it. A flaming match head lands on your arm and is quenched first with lye and then sulfuric acid.",
    200
);

createCard(
    "Unstable Paper Wasp",
    "Polistes instabilis",
    2.0,
    "Like a dinner guest who stays muych too long, the pain drones on. A hot Dutch oven lands on your hand and you can't get it off.",
    200
);

createCard(
    "Red Paper Wasp",
    "Polistes canadensis",
    3.0,
    "Caustic and burning. Distinctly bitter aftertaste. Like spilling a beaker of hydrochloric acid on a paper cut.",
    300
);

createCard(
    "Maricopa Harvester Ant",
    "Pogonomyrmex maricopa",
    3.0,
    "After eight unrelenting hours of drilling into that ingrown toenail, you find the drill is wedged in the toe.",
    300
);

createCard(
    "Giant Paper Wasp",
    "Megapolistes sp.",
    3.0,
    "There are gods, and they do throw thunderbolts. Poseidon has rammed his trident into your breast.",
    300
);

createCard(
    "Fierce Black Polybia Wasp",
    "Polybia Simillima",
    2.5,
    "A ritual gone wrong, Satanic. The gas lamp in the old church explodes in your face when you light it.",
    250
);

createCard(
    "Trap-Jaw Ant",
    "Odontomachus spp.",
    2.5,
    "Instantaneous and excruciating. A rat trap snaps your index fingernail.",
    250
);

createCard(
    "Little Wasp",
    "Polybia occidentalis",
    1.0,
    "Sharp meets spice. A slender cactus spine brushed a buffalo wing before it poked your arm.",
    100
);

createCard(
    "Red Fire Ant",
    "Solenopsis invicta",
    1.0,
    "Sharp, sudden, mildly alarming. Like walking across a shag carpet and reaching for the light switch.",
    100
);

createCard(
    "Sweat Bee",
    "Lasioglossum spp.",
    1.0,
    "Light and ephemeral, almost fruity. A tiny spark has singed a single hair on your arm.",
    100
);

createCard(
    "Slender Twig Ant",
    "Tetraponera sp.",
    1.0,
    "A skinny bully's punch. It's too weak to hurt but you suspect a cheap trick might be coming.",
    100
);

createCard(
    "Artistic Wasp",
    "Parachartergus fraternus",
    2.0,
    "Pure, then messy, then corrosive. Love and marriage followed by divorce.",
    200
);

createCard(
    "Glorious Velvet Ant",
    "Dasymutilla gloriosa",
    2.0,
    "Instantaneous, like the surprise of being stabbed. Is this what shrapnel feels like?",
    200
);

createCard(
    "Giant Sweat Bee",
    "Dienuomia heteropoda",
    1.5,
    "Size matters but it isn't everything. A silver tablespoon drops squarely onto your big toenail, sending you hopping.",
    150
);

module.exports = {getCard, getRandomCard, getRandomCards, getAllCards};