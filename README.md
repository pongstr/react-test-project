# React List component

## Tech stack
- React
- Typescript

## TODO

### Implement a List component with the following features:

- Accepts an array of JSON data with any structure;
- Accepts a required prop with renderer function;
- Multiple items can be checked;
- Avoid unnecessary re-renders (performance);

### General requirements
- Use Typescript (no `any` please)
- Show indexes of the checked List items in the header of the page;
- Generate a dummy dataset with at least 100 items to test your solution;
- Make nice UI;
- Along with the solution's source code, provide setup instructions if any;

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