import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AvatarCharacter {
  name: string;
  image: string;
  description: string;
  traits: string[];
  book: string;
}

const AVATAR_CHARACTERS: Record<string, AvatarCharacter> = {
  // Fantasy - Harry Potter
  fantasy_explorer: {
    name: "Harry Potter",
    image: "https://upload.wikimedia.org/wikipedia/en/d/d7/Harry_Potter_character_poster.jpg",
    description: "The Boy Who Lived! Like Harry, you're drawn to magical worlds and epic adventures. Your love for fantasy reveals a brave heart that believes in the power of friendship and good over evil.",
    traits: ["Brave", "Loyal", "Adventurous"],
    book: "Harry Potter Series"
  },
  fantasy_wizard: {
    name: "Frodo Baggins",
    image: "https://upload.wikimedia.org/wikipedia/en/4/4e/Elijah_Wood_as_Frodo_Baggins.png",
    description: "A humble hero like Frodo! Your love for fantasy shows your incredible resilience and willingness to bear great burdens for the greater good.",
    traits: ["Humble", "Resilient", "Courageous"],
    book: "The Lord of the Rings"
  },
  // Romance - Elizabeth Bennet
  romance_poet: {
    name: "Elizabeth Bennet",
    image: "https://upload.wikimedia.org/wikipedia/en/3/33/Keira_Knightley_as_Elizabeth_Bennet.jpg",
    description: "Sharp-witted and independent like Elizabeth Bennet. Your passion for romance reveals your emotional depth, wit, and belief in finding true love on your own terms.",
    traits: ["Witty", "Independent", "Passionate"],
    book: "Pride and Prejudice"
  },
  romance_dreamer: {
    name: "Jane Eyre",
    image: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Jane_Eyre_title_page.jpg",
    description: "A fiercely independent soul like Jane Eyre. Your romantic nature is balanced by strong moral principles and unwavering self-respect.",
    traits: ["Independent", "Moral", "Passionate"],
    book: "Jane Eyre"
  },
  // Mystery/Thriller - Nancy Drew
  mystery_detective: {
    name: "Nancy Drew",
    image: "https://upload.wikimedia.org/wikipedia/en/a/a9/Nancy_Drew_Mystery_Stories_Cover_Art.jpg",
    description: "A brilliant amateur sleuth like Nancy Drew! Your love for mysteries shows your sharp analytical mind, keen intuition, and unstoppable curiosity to solve puzzles.",
    traits: ["Clever", "Curious", "Resourceful"],
    book: "Nancy Drew Mystery Series"
  },
  mystery_sleuth: {
    name: "Hercule Poirot",
    image: "https://upload.wikimedia.org/wikipedia/en/5/54/Poirot_-_David_Suchet.jpg",
    description: "A meticulous detective like Hercule Poirot! You use your little grey cells to unravel the most complex mysteries with precision and flair.",
    traits: ["Meticulous", "Brilliant", "Eccentric"],
    book: "Hercule Poirot Series"
  },
  // Sci-Fi - Paul Atreides
  scifi_voyager: {
    name: "Paul Atreides",
    image: "https://upload.wikimedia.org/wikipedia/en/1/1e/Paul_Atreides_Dune_2021.jpg",
    description: "A visionary leader like Paul Atreides from Dune. Your love for sci-fi reveals your forward-thinking nature and fascination with destiny, power, and the future of humanity.",
    traits: ["Visionary", "Strategic", "Prescient"],
    book: "Dune"
  },
  scifi_pioneer: {
    name: "Ender Wiggin",
    image: "https://upload.wikimedia.org/wikipedia/en/e/e4/Ender%27s_game_cover_ISBN_0312932081.jpg",
    description: "A tactical genius like Ender Wiggin! Your sci-fi interests reveal your strategic mind and ability to see solutions others miss.",
    traits: ["Strategic", "Empathetic", "Genius"],
    book: "Ender's Game"
  },
  // Non-fiction/Self-help - Santiago (The Alchemist)
  knowledge_seeker: {
    name: "Santiago",
    image: "https://upload.wikimedia.org/wikipedia/commons/c/c4/TheAlchemist.jpg",
    description: "A seeker of Personal Legend like Santiago. Your preference for wisdom and growth shows your commitment to following your dreams and listening to your heart.",
    traits: ["Dreamer", "Wise", "Persistent"],
    book: "The Alchemist"
  },
  knowledge_philosopher: {
    name: "Siddhartha",
    image: "https://upload.wikimedia.org/wikipedia/en/7/74/Hesse_Siddhartha_1922.jpg",
    description: "A spiritual seeker like Siddhartha! Your quest for knowledge reflects your deep desire to understand life's meaning and find inner peace.",
    traits: ["Spiritual", "Seeking", "Wise"],
    book: "Siddhartha"
  },
  // Horror - Victor Frankenstein
  shadow_walker: {
    name: "Victor Frankenstein",
    image: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Frankenstein%27s_monster_%28Boris_Karloff%29.jpg",
    description: "A boundary-pusher like Victor Frankenstein. Your love for horror shows your courage to explore dark themes and question the limits of human ambition.",
    traits: ["Ambitious", "Intense", "Curious"],
    book: "Frankenstein"
  },
  horror_hunter: {
    name: "Van Helsing",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Dracula1st.jpeg",
    description: "A fearless hunter like Van Helsing! Your affinity for horror shows your courage to face darkness and your dedication to protecting others.",
    traits: ["Fearless", "Dedicated", "Scholarly"],
    book: "Dracula"
  },
  // Historical fiction - Jay Gatsby
  time_traveler: {
    name: "Jay Gatsby",
    image: "https://upload.wikimedia.org/wikipedia/en/8/81/Gatsby_1974_redford.jpg",
    description: "A dreamer of the past like Jay Gatsby. Your love for historical fiction shows your romantic idealism and appreciation for the grandeur of bygone eras.",
    traits: ["Romantic", "Ambitious", "Mysterious"],
    book: "The Great Gatsby"
  },
  time_warrior: {
    name: "Scarlett O'Hara",
    image: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Vivien_Leigh_Gone_Wind_Restaured.jpg",
    description: "A survivor like Scarlett O'Hara! Your love for historical drama reveals your determination, resilience, and fierce will to overcome any obstacle.",
    traits: ["Determined", "Resilient", "Bold"],
    book: "Gone with the Wind"
  },
  // Adventure - Julian from Famous Five
  adventure_seeker: {
    name: "Julian",
    image: "https://upload.wikimedia.org/wikipedia/en/5/59/Famous_Five_01_-_Five_on_a_Treasure_Island_%28front_cover%29.jpg",
    description: "A natural leader like Julian from The Famous Five. Your taste for adventure reflects your bold spirit, sense of responsibility, and hunger for thrilling outdoor escapades.",
    traits: ["Bold", "Responsible", "Adventurous"],
    book: "The Famous Five"
  },
  adventure_explorer: {
    name: "Robinson Crusoe",
    image: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Robinson_Crusoe_1719_1st_edition.jpg",
    description: "A resilient survivor like Robinson Crusoe! Your adventurous spirit shows your resourcefulness and ability to thrive in any circumstance.",
    traits: ["Resourceful", "Independent", "Survivor"],
    book: "Robinson Crusoe"
  },
  adventure_pirate: {
    name: "Jim Hawkins",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/21/Treasure_Island-Scribner%27s-1911.jpg",
    description: "A brave young adventurer like Jim Hawkins! Your love for adventure reveals your courage to seek treasure and face pirates!",
    traits: ["Brave", "Curious", "Daring"],
    book: "Treasure Island"
  },
  // Literary fiction - Atticus Finch
  literary_artist: {
    name: "Atticus Finch",
    image: "https://upload.wikimedia.org/wikipedia/commons/1/10/Gregory_Peck_1948.jpg",
    description: "A moral compass like Atticus Finch. Your appreciation for literary fiction shows your thoughtful nature and commitment to justice and understanding.",
    traits: ["Wise", "Compassionate", "Principled"],
    book: "To Kill a Mockingbird"
  },
  literary_rebel: {
    name: "Holden Caulfield",
    image: "https://upload.wikimedia.org/wikipedia/commons/e/e0/The_Catcher_in_the_Rye_%281951%2C_first_edition_cover%29.jpg",
    description: "A thoughtful outsider like Holden Caulfield. Your literary taste reflects your sensitivity to authenticity and your quest to understand the adult world.",
    traits: ["Sensitive", "Observant", "Authentic"],
    book: "The Catcher in the Rye"
  },
  // Comedy/Humor - Don Quixote
  comedy_jester: {
    name: "Don Quixote",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/2c/Honore_Daumier_017_%28Don_Quixote%29.jpg",
    description: "An idealistic dreamer like Don Quixote! Your love for humor shows your ability to find joy in absurdity and your belief that imagination can change the world.",
    traits: ["Idealistic", "Humorous", "Imaginative"],
    book: "Don Quixote"
  },
  comedy_wit: {
    name: "Jeeves",
    image: "https://upload.wikimedia.org/wikipedia/en/6/66/Jeeves.jpg",
    description: "An unflappable genius like Jeeves! Your appreciation for wit and humor shows your clever mind and ability to solve any problem with grace.",
    traits: ["Clever", "Composed", "Witty"],
    book: "Jeeves & Wooster Series"
  },
  // Young Adult - Katniss Everdeen
  young_adult_hero: {
    name: "Katniss Everdeen",
    image: "https://upload.wikimedia.org/wikipedia/en/3/39/Katniss_Everdeen.jpg",
    description: "A fierce survivor like Katniss Everdeen. Your love for YA shows your rebellious spirit, protective nature, and belief in fighting for what's right.",
    traits: ["Fierce", "Protective", "Resilient"],
    book: "The Hunger Games"
  },
  young_adult_wizard: {
    name: "Percy Jackson",
    image: "https://upload.wikimedia.org/wikipedia/en/3/3b/The_Lightning_Thief_cover.jpg",
    description: "A demigod hero like Percy Jackson! Your YA taste shows your love for mythology, loyalty to friends, and ability to find humor in danger.",
    traits: ["Loyal", "Heroic", "Witty"],
    book: "Percy Jackson Series"
  },
  young_adult_rebel: {
    name: "Tris Prior",
    image: "https://upload.wikimedia.org/wikipedia/en/5/5c/Divergent_%28book%29_by_Veronica_Roth_US_Hardcover_2011.jpg",
    description: "A brave Divergent like Tris Prior! Your reading taste reflects your refusal to fit into a single category and courage to be yourself.",
    traits: ["Brave", "Selfless", "Divergent"],
    book: "Divergent"
  },
  // Poetry - Rumi
  poetry_muse: {
    name: "Rumi",
    image: "https://upload.wikimedia.org/wikipedia/commons/5/5d/Maulana_Rumi.jpg",
    description: "A soul touched by divine words like Rumi. Your affinity for poetry reveals your deep spirituality, sensitivity to beauty, and quest for transcendent love.",
    traits: ["Spiritual", "Poetic", "Loving"],
    book: "Rumi's Poetry Collections"
  },
  poetry_romantic: {
    name: "Emily Dickinson",
    image: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Emily_Dickinson_daguerreotype_%28cropped%29.jpg",
    description: "A reclusive genius like Emily Dickinson! Your love for poetry shows your rich inner world and ability to find profound beauty in small moments.",
    traits: ["Introspective", "Brilliant", "Unique"],
    book: "Emily Dickinson's Poems"
  },
  // Memoir/Autobiography - Anne Frank
  memoir_chronicler: {
    name: "Anne Frank",
    image: "https://upload.wikimedia.org/wikipedia/commons/7/75/Anne_Frank_passport_photo%2C_May_1942.jpg",
    description: "A hopeful chronicler like Anne Frank. Your love for memoirs shows your deep empathy, belief in humanity's goodness, and appreciation for authentic stories.",
    traits: ["Hopeful", "Empathetic", "Reflective"],
    book: "The Diary of a Young Girl"
  },
  // Crime - Sherlock Holmes
  crime_solver: {
    name: "Sherlock Holmes",
    image: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Sherlock_Holmes_Portrait_Paget.jpg",
    description: "The world's greatest detective! Like Sherlock Holmes, you possess exceptional observational skills and a brilliant deductive mind that craves intellectual challenges.",
    traits: ["Brilliant", "Observant", "Logical"],
    book: "Sherlock Holmes Series"
  },
  crime_mastermind: {
    name: "Miss Marple",
    image: "https://upload.wikimedia.org/wikipedia/en/f/f3/Joan_Hickson_Miss_Marple.jpg",
    description: "A keen observer like Miss Marple! Your crime fiction taste shows your belief that human nature is the same everywhere, and your sharp eye for detail.",
    traits: ["Observant", "Wise", "Unassuming"],
    book: "Miss Marple Series"
  },
  // Community champions - Based on engagement levels
  community_champion: {
    name: "Gandalf",
    image: "https://upload.wikimedia.org/wikipedia/en/e/e9/Gandalf600ppx.jpg",
    description: "A wise guide like Gandalf! Your exceptional engagement shows your passion for bringing readers together and guiding others on their literary journeys.",
    traits: ["Wise", "Inspiring", "Leader"],
    book: "The Lord of the Rings"
  },
  community_mentor: {
    name: "Dumbledore",
    image: "https://upload.wikimedia.org/wikipedia/en/thumb/4/40/Dumbledore_-_Michael_Gambon.jpg/220px-Dumbledore_-_Michael_Gambon.jpg",
    description: "A beloved mentor like Dumbledore! Your guidance and wisdom make you a beacon for fellow readers seeking literary enlightenment.",
    traits: ["Wise", "Patient", "Mysterious"],
    book: "Harry Potter Series"
  },
  community_rising: {
    name: "Samwise Gamgee",
    image: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e7/Sean_Astin_as_Samwise_Gamgee.png/220px-Sean_Astin_as_Samwise_Gamgee.png",
    description: "A loyal companion like Sam! Your growing engagement shows true dedication to the reading community.",
    traits: ["Loyal", "Brave", "Supportive"],
    book: "The Lord of the Rings"
  },
  community_newcomer: {
    name: "Bilbo Baggins",
    image: "https://upload.wikimedia.org/wikipedia/en/0/0f/Bilbo_Baggins_from_The_Hobbit_Trilogy.jpg",
    description: "An unexpected adventurer like Bilbo! You're just beginning your literary journey, but great things await.",
    traits: ["Curious", "Brave", "Growing"],
    book: "The Hobbit"
  },
  // Super engaged - thread creators
  discussion_leader: {
    name: "Socrates",
    image: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Socrates_Louvre.jpg",
    description: "A great questioner like Socrates! Your many discussions inspire deep thinking and intellectual discourse.",
    traits: ["Philosophical", "Questioning", "Wise"],
    book: "Plato's Dialogues"
  },
  // Vote enthusiasts
  vote_enthusiast: {
    name: "Oscar Wilde",
    image: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Oscar_Wilde_portrait.jpg",
    description: "A critic with impeccable taste like Oscar Wilde! Your votes shape the community's reading landscape.",
    traits: ["Discerning", "Witty", "Influential"],
    book: "The Picture of Dorian Gray"
  },
  // Book curators
  book_curator: {
    name: "Jorge Luis Borges",
    image: "https://upload.wikimedia.org/wikipedia/commons/c/cf/Jorge_Luis_Borges_1951%2C_by_Grete_Stern.jpg",
    description: "A master librarian like Borges! Your book contributions build an infinite library of wonder.",
    traits: ["Scholarly", "Imaginative", "Curator"],
    book: "The Library of Babel"
  },
  // Children's classics
  childrens_dreamer: {
    name: "Alice",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Alice_par_John_Tenniel_02.png",
    description: "A curious adventurer like Alice! Your whimsical taste shows your open-minded nature and love for exploring impossible worlds.",
    traits: ["Curious", "Imaginative", "Bold"],
    book: "Alice in Wonderland"
  },
  childrens_hero: {
    name: "Peter Pan",
    image: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Peter_Pan_1915_cover_2.jpg",
    description: "A forever-young spirit like Peter Pan! Your reading taste reflects your refusal to lose your sense of wonder and adventure.",
    traits: ["Youthful", "Adventurous", "Free-spirited"],
    book: "Peter Pan"
  },
  // Thriller
  thriller_spy: {
    name: "James Bond",
    image: "https://upload.wikimedia.org/wikipedia/en/c/c5/Fleming007impression.jpg",
    description: "A suave agent like James Bond! Your thriller taste reveals your love for action, sophistication, and living on the edge.",
    traits: ["Suave", "Daring", "Resourceful"],
    book: "James Bond Series"
  },
  thriller_investigator: {
    name: "Robert Langdon",
    image: "https://upload.wikimedia.org/wikipedia/en/8/8a/The_Da_Vinci_Code.jpg",
    description: "A symbologist like Robert Langdon! Your thriller taste shows your love for codes, history, and unraveling ancient mysteries.",
    traits: ["Scholarly", "Quick-thinking", "Curious"],
    book: "The Da Vinci Code"
  },
  // Gothic/Dark Romance
  gothic_romantic: {
    name: "Heathcliff",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Wuthering_Heights_1939_Olivier.jpg",
    description: "A passionate soul like Heathcliff! Your dark romantic nature reveals intense emotions and a love that transcends conventional boundaries.",
    traits: ["Passionate", "Intense", "Brooding"],
    book: "Wuthering Heights"
  },
  gothic_heroine: {
    name: "Catherine Earnshaw",
    image: "https://upload.wikimedia.org/wikipedia/commons/8/8f/Emily_Bront%C3%AB_by_Patrick_Branwell_Bront%C3%AB_restored.jpg",
    description: "A wild spirit like Catherine! Your reading taste reflects your fierce independence and connection to nature's raw power.",
    traits: ["Wild", "Passionate", "Free-spirited"],
    book: "Wuthering Heights"
  },
  // Classic Literature
  classic_gentleman: {
    name: "Mr. Darcy",
    image: "https://upload.wikimedia.org/wikipedia/en/b/b3/Colin_Firth_Mr_Darcy.jpg",
    description: "A proud but good-hearted soul like Mr. Darcy! Your literary taste shows depth beneath a reserved exterior.",
    traits: ["Proud", "Loyal", "Honorable"],
    book: "Pride and Prejudice"
  },
  classic_dreamer: {
    name: "Emma Bovary",
    image: "https://upload.wikimedia.org/wikipedia/commons/0/0f/Madame_Bovary_1857.jpg",
    description: "A romantic idealist like Emma Bovary! Your taste reveals a longing for beauty and passion beyond ordinary life.",
    traits: ["Romantic", "Dreamer", "Passionate"],
    book: "Madame Bovary"
  },
  // Russian Literature
  russian_soul: {
    name: "Raskolnikov",
    image: "https://upload.wikimedia.org/wikipedia/commons/7/78/Dostoevsky_1872.jpg",
    description: "A complex thinker like Raskolnikov! Your reading reveals deep philosophical questioning and moral exploration.",
    traits: ["Philosophical", "Complex", "Intense"],
    book: "Crime and Punishment"
  },
  russian_prince: {
    name: "Prince Myshkin",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Dostoevsky_The_Idiot_cover.jpg",
    description: "A pure soul like Prince Myshkin! Your literary taste reflects innocence, compassion, and seeing good in everyone.",
    traits: ["Innocent", "Compassionate", "Pure"],
    book: "The Idiot"
  },
  russian_aristocrat: {
    name: "Anna Karenina",
    image: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Anna_Karenina_1877_cover.jpg",
    description: "A passionate aristocrat like Anna Karenina! Your reading taste reveals deep emotions and tragic beauty.",
    traits: ["Passionate", "Tragic", "Beautiful"],
    book: "Anna Karenina"
  },
  // Magical Realism
  magical_realist: {
    name: "Remedios the Beauty",
    image: "https://upload.wikimedia.org/wikipedia/en/a/a9/Cien_a%C3%B1os_de_soledad_%28book_cover%2C_1967%29.jpg",
    description: "An ethereal being like Remedios! Your taste for magical realism shows appreciation for wonder in everyday life.",
    traits: ["Ethereal", "Innocent", "Magical"],
    book: "One Hundred Years of Solitude"
  },
  // Japanese Literature
  japanese_wanderer: {
    name: "Musashi Miyamoto",
    image: "https://upload.wikimedia.org/wikipedia/commons/7/72/Miyamoto_Musashi_Self-Portrait.jpg",
    description: "A disciplined warrior like Musashi! Your reading reveals dedication to mastery and the way of self-improvement.",
    traits: ["Disciplined", "Wise", "Warrior"],
    book: "Musashi"
  },
  japanese_prince: {
    name: "Prince Genji",
    image: "https://upload.wikimedia.org/wikipedia/commons/0/0f/Tosa_Mitsuoki_-_Genji_monogatari.jpg",
    description: "An aesthetic soul like Prince Genji! Your taste reveals appreciation for beauty, art, and refined emotions.",
    traits: ["Aesthetic", "Romantic", "Cultured"],
    book: "The Tale of Genji"
  },
  // American Classics
  american_captain: {
    name: "Captain Ahab",
    image: "https://upload.wikimedia.org/wikipedia/commons/3/36/Moby_Dick_p510_illustration.jpg",
    description: "An obsessive seeker like Captain Ahab! Your reading reveals determination and pursuit of the impossible.",
    traits: ["Obsessive", "Determined", "Intense"],
    book: "Moby Dick"
  },
  american_rebel: {
    name: "Huckleberry Finn",
    image: "https://upload.wikimedia.org/wikipedia/commons/6/61/Huckleberry_Finn_book.JPG",
    description: "A free spirit like Huck Finn! Your taste reveals independence, moral courage, and love for adventure.",
    traits: ["Free-spirited", "Moral", "Adventurous"],
    book: "Adventures of Huckleberry Finn"
  },
  // Epic Heroes
  epic_warrior: {
    name: "Achilles",
    image: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Achilles_and_Penthesilea_fighting%2C_Staatliche_Antikensammlungen_8705.jpg",
    description: "A legendary warrior like Achilles! Your taste for epics shows love for heroism, glory, and fateful destinies.",
    traits: ["Heroic", "Proud", "Legendary"],
    book: "The Iliad"
  },
  epic_voyager: {
    name: "Odysseus",
    image: "https://upload.wikimedia.org/wikipedia/commons/1/10/Arnold_B%C3%B6cklin_-_Odysseus_and_Polyphemus.jpg",
    description: "A cunning voyager like Odysseus! Your reading reveals cleverness, resilience, and longing for home.",
    traits: ["Cunning", "Resilient", "Adventurous"],
    book: "The Odyssey"
  },
  // Modern Dystopia
  dystopia_rebel: {
    name: "Winston Smith",
    image: "https://upload.wikimedia.org/wikipedia/en/c/c3/1984first.jpg",
    description: "A truth-seeker like Winston Smith! Your dystopian taste reveals concern for freedom and truth in society.",
    traits: ["Rebellious", "Thoughtful", "Brave"],
    book: "1984"
  },
  dystopia_savage: {
    name: "Bernard Marx",
    image: "https://upload.wikimedia.org/wikipedia/en/6/62/BraveNewWorld_FirstEdition.jpg",
    description: "An outsider like Bernard Marx! Your reading reveals questioning of societal norms and search for authenticity.",
    traits: ["Outsider", "Questioning", "Sensitive"],
    book: "Brave New World"
  },
  // Fantasy Additional
  fantasy_queen: {
    name: "Daenerys Targaryen",
    image: "https://upload.wikimedia.org/wikipedia/en/0/0d/Daenerys_Targaryen_with_Dragon-Emilia_Clarke.jpg",
    description: "A mother of dragons like Daenerys! Your fantasy taste reveals ambition, strength, and desire for justice.",
    traits: ["Ambitious", "Powerful", "Liberator"],
    book: "A Song of Ice and Fire"
  },
  fantasy_knight: {
    name: "Aragorn",
    image: "https://upload.wikimedia.org/wikipedia/en/3/35/Aragorn300ppx.jpg",
    description: "A rightful king like Aragorn! Your fantasy taste shows nobility, courage, and readiness to accept destiny.",
    traits: ["Noble", "Brave", "Leader"],
    book: "The Lord of the Rings"
  },
  fantasy_assassin: {
    name: "Kvothe",
    image: "https://upload.wikimedia.org/wikipedia/en/5/56/TheNameoftheWind_cover.jpg",
    description: "A legendary figure like Kvothe! Your fantasy taste reveals love for music, magic, and becoming a legend.",
    traits: ["Talented", "Mysterious", "Legendary"],
    book: "The Name of the Wind"
  },
  // Humor Additional
  humor_eccentric: {
    name: "Ignatius J. Reilly",
    image: "https://upload.wikimedia.org/wikipedia/en/6/66/ConfederacyOfDunces.jpg",
    description: "A magnificent eccentric like Ignatius! Your humor taste reveals appreciation for absurdity and unique perspectives.",
    traits: ["Eccentric", "Intellectual", "Unique"],
    book: "A Confederacy of Dunces"
  },
  // Gothic Horror
  gothic_count: {
    name: "Count Dracula",
    image: "https://upload.wikimedia.org/wikipedia/en/c/c8/Bela_Lugosi_as_Dracula_%28Universal%29.jpg",
    description: "A lord of darkness like Dracula! Your gothic taste reveals fascination with immortality and the supernatural.",
    traits: ["Mysterious", "Powerful", "Immortal"],
    book: "Dracula"
  },
  gothic_doctor: {
    name: "Dr. Jekyll",
    image: "https://upload.wikimedia.org/wikipedia/commons/7/78/Dr_Jekyll_and_Mr_Hyde_poster_edit2.jpg",
    description: "A dual nature like Dr. Jekyll! Your reading reveals fascination with humanity's light and dark sides.",
    traits: ["Dual", "Scientific", "Tragic"],
    book: "The Strange Case of Dr Jekyll and Mr Hyde"
  },
  // Children's Additional
  childrens_wizard: {
    name: "Mary Poppins",
    image: "https://upload.wikimedia.org/wikipedia/en/e/e9/Mary_Poppins5.jpg",
    description: "Practically perfect like Mary Poppins! Your reading reveals love for magic hidden in ordinary life.",
    traits: ["Magical", "Proper", "Mysterious"],
    book: "Mary Poppins"
  },
  childrens_bear: {
    name: "Winnie-the-Pooh",
    image: "https://upload.wikimedia.org/wikipedia/en/1/10/Winniethepooh.png",
    description: "A bear of very little brain like Pooh! Your taste reveals simple wisdom, friendship, and love for honey.",
    traits: ["Simple", "Loyal", "Wise"],
    book: "Winnie-the-Pooh"
  },
  childrens_orphan: {
    name: "Anne Shirley",
    image: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Anne_of_Green_Gables_title_page.jpg",
    description: "An imaginative spirit like Anne! Your reading reveals optimism, creativity, and romantic imagination.",
    traits: ["Imaginative", "Optimistic", "Spirited"],
    book: "Anne of Green Gables"
  },
  // Science Fiction Additional
  scifi_android: {
    name: "R. Daneel Olivaw",
    image: "https://upload.wikimedia.org/wikipedia/en/8/8e/Robot_series_omnibus_cover.jpg",
    description: "A faithful robot like Daneel! Your sci-fi taste reveals questions about humanity and artificial life.",
    traits: ["Logical", "Loyal", "Ethical"],
    book: "The Robot Series"
  },
  scifi_pilot: {
    name: "Valentine Michael Smith",
    image: "https://upload.wikimedia.org/wikipedia/en/d/d3/StrangerInAStrangeLand.jpg",
    description: "A stranger in a strange land like Michael! Your sci-fi taste reveals openness to alien perspectives.",
    traits: ["Innocent", "Powerful", "Loving"],
    book: "Stranger in a Strange Land"
  },
  // Default - Hermione Granger
  balanced_reader: {
    name: "Hermione Granger",
    image: "https://upload.wikimedia.org/wikipedia/en/d/d3/Hermione_Granger_poster.jpg",
    description: "A voracious reader like Hermione Granger! Your diverse reading habits show your incredible thirst for knowledge and ability to find wisdom in every genre.",
    traits: ["Brilliant", "Studious", "Loyal"],
    book: "Harry Potter Series"
  },
  // Additional Fantasy Characters
  fantasy_witch: {
    name: "Ged (Sparrowhawk)",
    image: "https://upload.wikimedia.org/wikipedia/en/3/3d/A_Wizard_of_Earthsea%2C_first_hardcover_edition.jpg",
    description: "A true namer like Ged! Your fantasy taste reveals understanding of language's power and shadow integration.",
    traits: ["Wise", "Powerful", "Humble"],
    book: "A Wizard of Earthsea"
  },
  fantasy_hobbit: {
    name: "Samwise Gamgee",
    image: "https://upload.wikimedia.org/wikipedia/en/e/e7/Sean_Astin_as_Samwise_Gamgee.png",
    description: "The truest hero like Sam! Your fantasy taste shows loyalty, hope, and the strength of simple courage.",
    traits: ["Loyal", "Hopeful", "Brave"],
    book: "The Lord of the Rings"
  },
  // Additional Romance Characters
  romance_rebel: {
    name: "Marianne Dashwood",
    image: "https://upload.wikimedia.org/wikipedia/commons/9/9b/JaneAusten.jpg",
    description: "A passionate romantic like Marianne! Your heart leads your reading journey with intensity.",
    traits: ["Passionate", "Expressive", "Romantic"],
    book: "Sense and Sensibility"
  },
  romance_diplomat: {
    name: "Count Vronsky",
    image: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Anna_Karenina_1877_cover.jpg",
    description: "A passionate pursuer like Vronsky! Your romantic taste shows intensity and devotion.",
    traits: ["Passionate", "Bold", "Devoted"],
    book: "Anna Karenina"
  },
  // Additional Mystery Characters
  mystery_professor: {
    name: "Professor Moriarty",
    image: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Sherlock_Holmes_Portrait_Paget.jpg",
    description: "A mastermind like Moriarty! Your love for mystery shows appreciation for genius-level scheming.",
    traits: ["Genius", "Strategic", "Formidable"],
    book: "Sherlock Holmes Series"
  },
  mystery_noir: {
    name: "Philip Marlowe",
    image: "https://upload.wikimedia.org/wikipedia/en/2/27/The_Big_Sleep_%281939_novel%29_1st_ed_cover.jpg",
    description: "A hardboiled detective like Marlowe! Your mystery taste shows grit and moral complexity.",
    traits: ["Tough", "Honorable", "Cynical"],
    book: "The Big Sleep"
  },
  // Additional Sci-Fi Characters
  scifi_captain: {
    name: "Captain Nemo",
    image: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Jules_Verne.jpg",
    description: "A visionary explorer like Captain Nemo! Your sci-fi taste shows love for innovation and mystery.",
    traits: ["Visionary", "Mysterious", "Independent"],
    book: "Twenty Thousand Leagues Under the Sea"
  },
  scifi_rebel: {
    name: "Neo",
    image: "https://upload.wikimedia.org/wikipedia/en/c/c5/The_Matrix_Poster.jpg",
    description: "A chosen one like Neo! Your sci-fi taste reveals questioning of reality and hidden potential.",
    traits: ["Awakened", "Powerful", "Questioning"],
    book: "The Matrix (Inspired)"
  },
  // Additional Horror Characters
  horror_writer: {
    name: "Jack Torrance",
    image: "https://upload.wikimedia.org/wikipedia/en/4/4a/The_Shining_%281977%29_front_cover%2C_first_edition.jpg",
    description: "A haunted soul like Jack! Your horror taste shows fascination with isolation and madness.",
    traits: ["Creative", "Obsessive", "Haunted"],
    book: "The Shining"
  },
  horror_survivor: {
    name: "Clarice Starling",
    image: "https://upload.wikimedia.org/wikipedia/en/8/86/The_Silence_of_the_Lambs_poster.jpg",
    description: "A brave agent like Clarice! Your thriller taste shows courage to face the darkest minds.",
    traits: ["Brave", "Intuitive", "Determined"],
    book: "The Silence of the Lambs"
  },
  // Additional Adventure Characters
  adventure_archaeologist: {
    name: "Indiana Jones",
    image: "https://upload.wikimedia.org/wikipedia/en/8/8e/Indiana_Jones_in_Raiders_of_the_Lost_Ark.jpg",
    description: "An artifact hunter like Indy! Your adventure taste reveals love for history and daring expeditions.",
    traits: ["Adventurous", "Scholarly", "Daring"],
    book: "Indiana Jones Adventures"
  },
  adventure_captain: {
    name: "Long John Silver",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/21/Treasure_Island-Scribner%27s-1911.jpg",
    description: "A charming rogue like Long John! Your adventure taste shows appreciation for cunning and ambiguity.",
    traits: ["Cunning", "Charismatic", "Complex"],
    book: "Treasure Island"
  },
  // Philosophical Readers
  philosophy_stoic: {
    name: "Marcus Aurelius",
    image: "https://upload.wikimedia.org/wikipedia/commons/e/e9/Marcus_Aurelius_Glyptothek_Munich.jpg",
    description: "A philosopher-king like Marcus Aurelius! Your reading reveals commitment to virtue and self-mastery.",
    traits: ["Stoic", "Wise", "Disciplined"],
    book: "Meditations"
  },
  philosophy_existentialist: {
    name: "Meursault",
    image: "https://upload.wikimedia.org/wikipedia/commons/f/fc/Albert_Camus%2C_gagnant_de_prix_Nobel%2C_portrait_en_buste%2C_pos%C3%A9_au_bureau%2C_faisant_face_%C3%A0_gauche%2C_cigarette_de_tabagisme.jpg",
    description: "An honest outsider like Meursault! Your reading shows confrontation with life's absurdity.",
    traits: ["Honest", "Detached", "Authentic"],
    book: "The Stranger"
  },
  // Contemporary Fiction
  contemporary_observer: {
    name: "Nick Carraway",
    image: "https://upload.wikimedia.org/wikipedia/commons/a/a0/The_Great_Gatsby_Cover_1925_Retouched.jpg",
    description: "A reserved observer like Nick! Your reading shows appreciation for witnessing extraordinary lives.",
    traits: ["Observant", "Honest", "Reflective"],
    book: "The Great Gatsby"
  },
  // World Literature
  world_traveler: {
    name: "Phileas Fogg",
    image: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Jules_Verne.jpg",
    description: "A precise adventurer like Phileas Fogg! Your reading spans the world with clockwork precision.",
    traits: ["Precise", "Adventurous", "Determined"],
    book: "Around the World in Eighty Days"
  },
  world_wanderer: {
    name: "The Little Prince",
    image: "https://upload.wikimedia.org/wikipedia/en/0/05/Littleprince.JPG",
    description: "A wise traveler like the Little Prince! Your reading reveals childlike wonder and profound wisdom.",
    traits: ["Wise", "Innocent", "Loving"],
    book: "The Little Prince"
  },
  // Psychological Fiction
  psychological_narrator: {
    name: "Humbert Humbert",
    image: "https://upload.wikimedia.org/wikipedia/en/2/2e/Lolita_1955.JPG",
    description: "An unreliable narrator! Your psychological taste shows appreciation for complex, morally ambiguous storytelling.",
    traits: ["Complex", "Literary", "Unreliable"],
    book: "Lolita"
  },
  psychological_split: {
    name: "The Narrator (Fight Club)",
    image: "https://upload.wikimedia.org/wikipedia/en/f/fc/Fight_Club_poster.jpg",
    description: "A questioning self like the Narrator! Your reading reveals exploration of identity and society.",
    traits: ["Conflicted", "Rebellious", "Searching"],
    book: "Fight Club"
  },
  // Satire
  satire_observer: {
    name: "Gulliver",
    image: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Gullivers_travels.jpg",
    description: "A bewildered traveler like Gulliver! Your satirical taste reveals sharp observation of human folly.",
    traits: ["Observant", "Naive", "Critical"],
    book: "Gulliver's Travels"
  },
  satire_rebel: {
    name: "Yossarian",
    image: "https://upload.wikimedia.org/wikipedia/en/9/99/Catch22.jpg",
    description: "A sane man in an insane world like Yossarian! Your reading shows appreciation for absurdist humor.",
    traits: ["Survivor", "Sane", "Rebellious"],
    book: "Catch-22"
  },
  // Feminist Literature
  feminist_voice: {
    name: "Celie",
    image: "https://upload.wikimedia.org/wikipedia/en/6/69/Colorpurple.jpg",
    description: "A survivor who found her voice like Celie! Your reading shows appreciation for resilience and sisterhood.",
    traits: ["Resilient", "Growing", "Loving"],
    book: "The Color Purple"
  },
  feminist_warrior: {
    name: "Offred",
    image: "https://upload.wikimedia.org/wikipedia/en/1/18/TheHandmaidsTale%281stEd%29.jpg",
    description: "A survivor like Offred! Your reading reveals concern for women's rights and bodily autonomy.",
    traits: ["Survivor", "Observant", "Resistant"],
    book: "The Handmaid's Tale"
  },
  // African Literature
  african_warrior: {
    name: "Okonkwo",
    image: "https://upload.wikimedia.org/wikipedia/en/6/65/ThingsFallApart.jpg",
    description: "A tragic hero like Okonkwo! Your reading shows engagement with colonialism and cultural change.",
    traits: ["Strong", "Proud", "Tragic"],
    book: "Things Fall Apart"
  },
  // Latin American Literature
  latin_magical: {
    name: "Colonel Aureliano Buendía",
    image: "https://upload.wikimedia.org/wikipedia/en/a/a9/Cien_a%C3%B1os_de_soledad_%28book_cover%2C_1967%29.jpg",
    description: "A legendary figure like Colonel Buendía! Your taste reveals love for sweeping family sagas and magical realism.",
    traits: ["Revolutionary", "Solitary", "Legendary"],
    book: "One Hundred Years of Solitude"
  },
  // Indian Literature
  indian_dreamer: {
    name: "Saleem Sinai",
    image: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b8/SalmanRushdieMidnightsChildren.jpg/220px-SalmanRushdieMidnightsChildren.jpg",
    description: "A midnight child like Saleem! Your reading reveals love for India's complexity and magical history.",
    traits: ["Telepathic", "Nostalgic", "Complex"],
    book: "Midnight's Children"
  },
  // Graphic Novel Enthusiast
  graphic_hero: {
    name: "Rorschach",
    image: "https://upload.wikimedia.org/wikipedia/en/a/a2/Watchmen%2C_issue_1.jpg",
    description: "An uncompromising vigilante like Rorschach! Your reading shows appreciation for moral complexity in visual storytelling.",
    traits: ["Uncompromising", "Dark", "Determined"],
    book: "Watchmen"
  },
  graphic_dreamer: {
    name: "Morpheus (Dream)",
    image: "https://upload.wikimedia.org/wikipedia/en/5/5a/Sandman1989.png",
    description: "The Lord of Dreams like Morpheus! Your reading reveals love for mythology and the power of stories.",
    traits: ["Mysterious", "Powerful", "Storyteller"],
    book: "The Sandman"
  }
};

const GENRE_MAPPING: Record<string, string[]> = {
  'fantasy': ['fantasy_explorer', 'fantasy_wizard', 'fantasy_queen', 'fantasy_knight', 'fantasy_assassin', 'fantasy_witch', 'fantasy_hobbit'],
  'romance': ['romance_poet', 'romance_dreamer', 'romance_rebel', 'romance_diplomat'],
  'mystery': ['mystery_detective', 'mystery_sleuth', 'mystery_professor', 'mystery_noir'],
  'thriller': ['thriller_spy', 'thriller_investigator', 'horror_survivor'],
  'science fiction': ['scifi_voyager', 'scifi_pioneer', 'scifi_android', 'scifi_pilot', 'scifi_captain', 'scifi_rebel'],
  'sci-fi': ['scifi_voyager', 'scifi_pioneer', 'scifi_android', 'scifi_captain'],
  'non-fiction': ['knowledge_seeker', 'knowledge_philosopher', 'philosophy_stoic'],
  'self-help': ['knowledge_seeker', 'philosophy_stoic', 'philosophy_existentialist'],
  'philosophy': ['knowledge_philosopher', 'philosophy_stoic', 'philosophy_existentialist'],
  'horror': ['shadow_walker', 'horror_hunter', 'gothic_count', 'gothic_doctor', 'horror_writer'],
  'gothic': ['gothic_romantic', 'gothic_heroine', 'gothic_count', 'gothic_doctor'],
  'historical fiction': ['time_traveler', 'time_warrior', 'classic_gentleman', 'classic_dreamer'],
  'history': ['time_traveler', 'memoir_chronicler', 'epic_warrior', 'epic_voyager'],
  'biography': ['memoir_chronicler', 'contemporary_observer'],
  'adventure': ['adventure_seeker', 'adventure_explorer', 'adventure_pirate', 'adventure_archaeologist', 'adventure_captain'],
  'action': ['adventure_seeker', 'thriller_spy', 'epic_warrior'],
  'literary fiction': ['literary_artist', 'literary_rebel', 'contemporary_observer', 'russian_soul'],
  'classics': ['literary_artist', 'classic_gentleman', 'classic_dreamer', 'russian_prince', 'russian_aristocrat'],
  'comedy': ['comedy_jester', 'comedy_wit', 'humor_eccentric', 'satire_observer', 'satire_rebel'],
  'humor': ['comedy_jester', 'comedy_wit', 'humor_eccentric'],
  'satire': ['satire_observer', 'satire_rebel', 'comedy_jester'],
  'young adult': ['young_adult_hero', 'young_adult_wizard', 'young_adult_rebel'],
  'ya': ['young_adult_hero', 'young_adult_wizard', 'young_adult_rebel'],
  'dystopian': ['dystopia_rebel', 'dystopia_savage', 'young_adult_hero', 'feminist_warrior'],
  'poetry': ['poetry_muse', 'poetry_romantic'],
  'memoir': ['memoir_chronicler', 'feminist_voice'],
  'autobiography': ['memoir_chronicler'],
  'crime': ['crime_solver', 'crime_mastermind', 'mystery_noir'],
  'detective': ['crime_solver', 'mystery_detective', 'mystery_sleuth'],
  'children': ['childrens_dreamer', 'childrens_hero', 'childrens_wizard', 'childrens_bear', 'childrens_orphan', 'world_wanderer'],
  'magical realism': ['magical_realist', 'latin_magical'],
  'japanese': ['japanese_wanderer', 'japanese_prince'],
  'russian': ['russian_soul', 'russian_prince', 'russian_aristocrat'],
  'american': ['american_captain', 'american_rebel'],
  'psychological': ['psychological_narrator', 'psychological_split'],
  'feminist': ['feminist_voice', 'feminist_warrior'],
  'african': ['african_warrior'],
  'graphic novel': ['graphic_hero', 'graphic_dreamer'],
  'comics': ['graphic_hero', 'graphic_dreamer'],
  'world literature': ['world_traveler', 'world_wanderer', 'indian_dreamer'],
  'epic': ['epic_warrior', 'epic_voyager'],
};

// Function to get a character from array based on user engagement for variety
const getCharacterFromArray = (keys: string[], seed: number): string => {
  const index = seed % keys.length;
  return keys[index];
};

export const useAvatarCard = (userId: string | undefined) => {
  const [character, setCharacter] = useState<AvatarCharacter | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      calculateAvatar();
    }
  }, [userId]);

  const calculateAvatar = async () => {
    if (!userId) return;
    setLoading(true);

    try {
      // Get user's favorite genre
      const { data: profile } = await supabase
        .from('profiles')
        .select('favorite_genre')
        .eq('id', userId)
        .maybeSingle();

      // Get genres from books user has uploaded
      const { data: userBooks } = await supabase
        .from('books')
        .select('id')
        .eq('created_by', userId);

      const bookIds = userBooks?.map(b => b.id) || [];
      
      // Get genres from user's books
      let bookGenres: string[] = [];
      if (bookIds.length > 0) {
        const { data: bookGenreData } = await supabase
          .from('book_genres')
          .select('genres(name)')
          .in('book_id', bookIds);
        
        bookGenres = bookGenreData?.map((bg: any) => bg.genres?.name?.toLowerCase()).filter(Boolean) || [];
      }

      // Get genres from books user has upvoted
      const { data: userVotes } = await supabase
        .from('votes')
        .select('votable_id')
        .eq('user_id', userId)
        .eq('votable_type', 'book')
        .eq('value', 1);

      const votedBookIds = userVotes?.map(v => v.votable_id) || [];
      
      let votedGenres: string[] = [];
      if (votedBookIds.length > 0) {
        const { data: votedBookGenres } = await supabase
          .from('book_genres')
          .select('genres(name)')
          .in('book_id', votedBookIds);
        
        votedGenres = votedBookGenres?.map((bg: any) => bg.genres?.name?.toLowerCase()).filter(Boolean) || [];
      }

      // Count threads started
      const { count: threadCount } = await supabase
        .from('threads')
        .select('*', { count: 'exact', head: true })
        .eq('created_by', userId);

      // Count total votes given
      const { count: voteCount } = await supabase
        .from('votes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Determine avatar based on engagement and genres
      const allGenres = [
        ...(profile?.favorite_genre ? [profile.favorite_genre.toLowerCase()] : []),
        ...bookGenres,
        ...votedGenres
      ];

      // Count genre occurrences
      const genreCounts: Record<string, number> = {};
      allGenres.forEach(genre => {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      });

      // Find dominant genre
      let dominantGenre = '';
      let maxCount = 0;
      Object.entries(genreCounts).forEach(([genre, count]) => {
        if (count > maxCount) {
          maxCount = count;
          dominantGenre = genre;
        }
      });

      // Calculate engagement metrics for avatar selection
      const totalEngagement = (threadCount || 0) + (voteCount || 0) + (userBooks?.length || 0);
      const booksCount = userBooks?.length || 0;
      const threadsCount = threadCount || 0;
      const votesCount = voteCount || 0;

      // Create a seed from user engagement for consistent but varied results
      const engagementSeed = booksCount * 7 + threadsCount * 13 + votesCount * 3;

      // Check for engagement-based avatars first (tiered system)
      if (totalEngagement >= 50) {
        // Legend tier - Master guide
        setCharacter(AVATAR_CHARACTERS.community_champion);
      } else if (totalEngagement >= 30) {
        // Mentor tier
        setCharacter(AVATAR_CHARACTERS.community_mentor);
      } else if (threadsCount >= 10) {
        // Discussion leader - many threads
        setCharacter(AVATAR_CHARACTERS.discussion_leader);
      } else if (votesCount >= 20) {
        // Vote enthusiast - many votes
        setCharacter(AVATAR_CHARACTERS.vote_enthusiast);
      } else if (booksCount >= 10) {
        // Book curator - many books added
        setCharacter(AVATAR_CHARACTERS.book_curator);
      } else if (totalEngagement >= 10) {
        // Rising community member
        setCharacter(AVATAR_CHARACTERS.community_rising);
      } else if (dominantGenre && GENRE_MAPPING[dominantGenre]) {
        // Genre-based avatar with variety
        const genreKeys = GENRE_MAPPING[dominantGenre];
        const characterKey = getCharacterFromArray(genreKeys, engagementSeed);
        setCharacter(AVATAR_CHARACTERS[characterKey]);
      } else if (profile?.favorite_genre) {
        const genreKeys = GENRE_MAPPING[profile.favorite_genre.toLowerCase()];
        if (genreKeys) {
          const characterKey = getCharacterFromArray(genreKeys, engagementSeed);
          setCharacter(AVATAR_CHARACTERS[characterKey]);
        } else {
          // New user - newcomer avatar
          if (totalEngagement >= 1) {
            setCharacter(AVATAR_CHARACTERS.community_newcomer);
          } else {
            setCharacter(AVATAR_CHARACTERS.balanced_reader);
          }
        }
      } else {
        // Completely new user
        if (totalEngagement >= 1) {
          setCharacter(AVATAR_CHARACTERS.community_newcomer);
        } else {
          setCharacter(AVATAR_CHARACTERS.balanced_reader);
        }
      }
    } catch (error) {
      console.error('Error calculating avatar:', error);
      setCharacter(AVATAR_CHARACTERS.balanced_reader);
    } finally {
      setLoading(false);
    }
  };

  return { character, loading };
};
