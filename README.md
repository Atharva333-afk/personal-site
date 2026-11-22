
# Atharva Naveen's Personal Website

<p align="center">
  <img src="assets/source/jerseys-cool/8.png" width="820" alt="A selection from Atharva's sports jersey archive">
</p>
I mean, it was always supposed to be a chill website. Nothing too serious, just a place where I could put whatever I wanted and keep changing things around.

I've always tried to make sure that every time I commit changes, there's some cool new feature or something different that y'all (I'm Texan) get to see. Sometimes it's a whole new section, sometimes it's just a small detail that probably nobody would notice, but I still wanted to add it.

I am a very... wait, IDEK what kinda person I am. I can be anyone and anyway on a given day. I have a bunch of different interests, and they keep changing depending on what I'm doing or what I feel like doing.

My website has tried to do that, to actually show who I am, or how I feel. I don't really want it to be one of those websites where you just have your name, a picture, a few projects, and that's it.

I wanted something a little more personal, something that I could keep working on whenever I felt like it.

---

## About the website

I started making this website because I wanted my own space on the internet. Somewhere I could just put things together without having to follow some specific format.

Over time, I've changed the design a lot, added new things, removed old ones, and tried out different ideas. Some of them actually worked out, and some of them didn't.

I also tend to spend way too much time on small details. I'll start by wanting to change one thing, and then a few hours later I've somehow changed an entire section of the website.

But I think that's what makes working on it fun.

I don't really have one set theme I want to stick to forever. I like trying different designs, layouts, animations, and features, and seeing how they all come together.

It's also not really supposed to be a traditional portfolio. Of course, I have my projects and things I've worked on, but I also wanted to include things that I personally find interesting, even if they don't necessarily have anything to do with coding.

---

## Why I keep changing things

I think a personal website should actually feel personal.

And since my interests and ideas keep changing, I don't see why the website shouldn't change with them.

Sometimes I'm working on coding projects, sometimes I'm doing something with design, and other times I'm interested in something completely different.

I wanted the website to have a little bit of everything instead of just focusing on one thing.

It's also been a way for me to learn new things. A lot of the features on here started with me seeing something interesting somewhere else and wanting to figure out how it worked.

And then I'd try making my own version of it.

I also like looking back at older versions of the website. It's interesting seeing how much has changed, even over a few months.

I don't really think there will ever be a final version of this website, because I'll probably keep finding new things to add or change.

And I'm completely fine with that.

---

## How it's built

The website is pretty simple when it comes to how it runs.

Most of it is **HTML, CSS, and JavaScript**, all in one place. I've tried different ways of organizing it over time, but for the current version I wanted to keep things straightforward.

There's no build step required, and you can run the whole thing locally with Python.

I've also kept some older assets and HTML exports in the repo because I might want to use them again, or just look back at how the website used to be.

### Technologies

- **HTML5** — For the structure and content.
- **CSS3** — For styling, layouts, animations, and everything else that makes the website look the way it does.
- **JavaScript** — For interactive features and functionality.
- **Python** — Only needed here if you want to run the local development server.

The website doesn't need a complicated framework or a bunch of dependencies to run. Most of the things I wanted to do could be done with regular HTML, CSS, and JavaScript, so that's what I went with.

---

## Preview locally

If you wanna run the website yourself, it's pretty simple.

First, clone the repository:

```bash
git clone https://github.com/Atharva333-afk/personal-site.git
```

Move into the project directory:

```bash
cd personal-site
```

Then start a local server:

```bash
python3 -m http.server 4173
```

Open the website in your browser:

**http://127.0.0.1:4173/**

And that's pretty much it.

You don't need to install any additional packages or run a build command.

The main page is `index.html`, and the same page is mirrored at `dist/index.html` because the hosted static-site configuration publishes the `dist/` directory.

If you're editing the website, make sure the deployment copy stays updated with the main file.

---

## Repository structure

Here's how everything is organized:

```text
personal-site/
│
├── index.html
├── README.md
├── .gitignore
│
├── dist/
│   └── index.html
│
├── archive/
│   └── site-exports/
│
├── assets/
│   ├── source/
│   ├── generated/
│   ├── css/
│   └── js/
│
└── scripts/
```

### What everything does

| File / Directory | Description |
|---|---|
| `index.html` | The main website, containing the HTML, CSS, JavaScript, content, and inline media. |
| `dist/index.html` | The deployment version of the main page. |
| `archive/site-exports/` | Older HTML exports, including the source export used for this release. |
| `assets/source/` | Original images and media preserved for future edits. |
| `assets/generated/` | Generated assets from earlier versions of the website. |
| `assets/css/` | Older CSS files retained for reference. |
| `assets/js/` | Older JavaScript files retained for reference. |
| `scripts/` | Additional project scripts. |

I've tried keeping things somewhat organized, although there's definitely some stuff in here from older versions that I haven't gotten around to cleaning up.

I also like keeping older versions of things around, mostly because I end up changing my mind about designs pretty often.

---

## Source media

The original media discovered on my computer and confirmed to match sections of the website is preserved in [`assets/source/`](assets/source/).

This includes:

- The denim collection.
- The sports collection.
- The Descreened project media library.
- Other original media associated with earlier versions of the website.

I've kept these files because I want to be able to go back and edit things without having to find all the original media again.

Some of these assets aren't being used in the current version of the website, but they were part of previous versions or projects, so I left them in the repo.

I think it's also pretty interesting to see how different files and designs have been used throughout the development of the website.

---

## Random things about this website

I don't think I've ever sat down and actually planned out the entire website before making changes.

Usually, I'll find something interesting, think about how it could work on my website, and then start trying to build it.

Sometimes I have absolutely no idea how to make something work, so I just keep messing around with it until I figure something out.

I've also had times where I spent hours working on something, only to realize that I liked the older version better.

And then I change it back.

I think that's just part of making something personal. You don't really have to worry about following a particular structure or making everything look a certain way.

You can just try stuff.

Another thing is that I really like interactive websites. I like when there's something you can actually do on a page instead of just scrolling through text and pictures.

So whenever I find something interesting that I think could work on here, I'll probably try adding it.

Some of those ideas might stay, and some might disappear in the next update.

---

## Future updates

I don't really have a fixed plan for where I want to take this website.

There are always new things I want to try, and I usually end up working on whatever idea I have at the time.

But there are a few things I'd like to keep doing:

- Adding new interactive features.
- Experimenting with different designs and layouts.
- Trying out new animations and visual effects.
- Finding more interesting ways to display my projects.
- Adding things from my other interests and hobbies.
- Improving the website on different screen sizes.
- Keeping older versions around so I can look back at them.

I'd also like to keep finding ways to make the website feel different from the usual personal portfolio sites.

Not necessarily by making everything complicated, but just by adding things that I personally find interesting.

And knowing myself, there's a pretty good chance I'll end up changing something I thought was already finished.

But that's kinda the whole point of this website.

It's not really meant to be finished.

---

## A note about the code

If you're looking through the code, you'll probably notice that some things could've been organized differently.

And yeah, you're probably right.

A lot of this website has been built by trying things out, experimenting with different ideas, and figuring out what works.

I don't necessarily want to spend all my time making the code look perfect when I could be working on something new for the website.

That doesn't mean I don't care about how things work. I just like having the flexibility to try something without making it into a huge project every time.

So if you find something interesting in the code, feel free to take a look at how it works.

And if you find something that makes absolutely no sense, there's a chance I was just experimenting with something and forgot about it.

---

## That's pretty much it

I made this website for myself, but I also wanted other people to be able to look through it and get to know me a little better.

It's a mix of things I've worked on, things I'm interested in, and random ideas I've had along the way.

I don't really know what this website is going to look like a few months from now, and I think that's what makes it interesting.

I'll probably keep changing things around, adding new features, and experimenting with whatever I find interesting.

So yeah, that's my website. Hope y'all like it.

If you wanna reach out or just say hi, you can email me at **[aty.naveen@gmail.com](mailto:aty.naveen@gmail.com)**.

---

*Made by Atharva Naveen.*
