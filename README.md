# React List component

To get started, simply run these commands:

yarn && yarn dev or
npm install && npm run dev
Please start on this file [src/App.tsx](https://github.com/pongstr/react-test-project/blob/main/src/App.tsx)

---

## Tech stack

- [x] React
- [x] Typescript

## ETA

~2-3 hours~ 😅 did it in 1hr

## TODO

### Implement a `List` component with the following features:

- [x] Accepts an array of JSON data with any structure;
- [ ] Accepts a required prop with renderer function which defines content of the `Info` column (see below);
- [x] Multiple items can be checked;
- [x] **Avoid unnecessary re-renders** (performance);

> - [ ] Accepts a required prop with renderer function which defines
>       content of the `Info` column (see below);

I'm not sure if I understood this correctly, please check the [implementation](https://github.com/pongstr/react-test-project/blob/main/src/App.tsx#L142-L155)

### General requirements

- [x] Use Typescript (no `any` please)
- [x] Show indexes of the checked `List` items in the header of the page;
- [x] Generate a dummy dataset with **at least 100** items to test your solution;
- [x] Make nice UI;
- [x] Push your solution to a public github repo and provide setup instructions if any;

## Sample datasets

Input 1:

```
[
  { id: 1, title: "Title 1" },
  { id: 2, title: "Title 2" },
  { id: 3, title: "Title 3" },
  ...
]`
```

Output 1:

```
--------------------------------
Selected items: 0, 2
--------------------------------

|   | Info    |
---------------
|[x]| Title 1 |
---------------
|[ ]| Title 2 |
---------------
|[x]| Title 3 |
---------------
...
---------------
```

Input 2:

```
[
  { name: "Name 1", description: "Description 1" },
  { name: "Name 2", description: "Description 2", link: "google.com" },
  { name: "Name 3", description: "Description 3" },
  ...
]`
```

Output 2:

```
--------------------------------
Selected items: 1
--------------------------------

|   | Info          |
---------------------
|[ ]| Name 1        |
|   | Description 1 |
---------------------
|[x]| Name 2        |
|   | Description 2 |
|   | google.com    |
---------------------
|[ ]| Name 3        |
|   | Description 3 |
---------------------
...
---------------------
```
