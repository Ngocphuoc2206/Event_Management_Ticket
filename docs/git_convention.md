# Git Convention

## Branch Strategy

We follow a simple branch strategy:

```
main
develop
feature/issue_số issue

```

---

### Develop Branch

Rules:

- All features merge into `develop`

---

### Feature Branch

Used for developing new features.

#### Format:

```
feature/issue_số issue
```

EX:

```
feature/issue_01
```

#### Rules:

- Created from `develop`
- Merged back into `develop`

---

### Write clear commit messages

#### Bad:

```

update code
fix bug

```

#### Good:

```
#issue: Description

EX: #01: Add login page
```
