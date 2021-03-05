import React from 'react';
import {AppBar, Button, fade, Grid, IconButton, InputBase, Toolbar, Tooltip} from "@material-ui/core";
import AccountCircleTwoToneIcon from '@material-ui/icons/AccountCircleTwoTone';
import HomeIcon from '@material-ui/icons/Home';
import SearchIcon from '@material-ui/icons/Search';
import {makeStyles} from "@material-ui/core/styles";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../firebase";
import {useHistory} from "react-router-dom";
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import HideOnScroll from "./HideOnScroll";
import KeyboardArrowUp from "@material-ui/icons/KeyboardArrowUp";
import Forum from "@material-ui/icons/Forum";
import BackToTop from "./BackToTop";
import Fab from "@material-ui/core/Fab";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import theme from "../theme";


const profilePictureSize = "35px"

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    circle: {
        borderRadius: "50%",
        height: "35px",
        width: "35px",
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
    },
    link: {},
    search: {
        flexGrow: 1,
        maxWidth: "50%",
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
        width: '100%',
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    homeIcon: {
        flex: 1,
        justifyContent: "flex-start"
    },
    profileIcon: {
        margin: 0,
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
    },
    chat: {
        color: "white",
    },
    profile: {
        "&:hover": {
            backgroundColor: "transparent"
        }
    },
}));

const Header = () => {
    const [user] = useAuthState(auth);
    const classes = useStyles();
    const history = useHistory();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);


    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClick = (pageURL) => {
        history.push(pageURL)
        setAnchorEl(null)
    };

    const onChange = (event) => {
        history.push(`/search=${event.target.value}`)
        if (event.target.value === "") {
            history.push("./")
        }
    };

    const onKeyPress = (event) => {
        // console.log(`Pressed keyCode ${event.key}`);
        if (event.key === 'Enter') {
            history.push(`/search=${event.target.value}`)
        }
    }

    return (
        <div className={classes.root}>
            <HideOnScroll>
                <AppBar position="fixed" elevation={0} color="primary">
                    <Toolbar>
                        <Grid
                            container
                            spacing={0}
                            alignItems="center"
                            align="center"
                        >
                            <Grid item xs={1}
                                  container
                                  alignItems="flex-start">
                                <Tooltip title="Home" aria-label="Home">
                                <IconButton aria-label="Go to profile" onClick={() => {
                                    history.push("/")
                                }}>
                                    <HomeIcon style={{fill: "white"}}/>
                                </IconButton>
                                </Tooltip>
                            </Grid>

                            <Grid item xs={9}>
                                <div>
                                    <div className={classes.search}>
                                        <div className={classes.searchIcon}>
                                            <SearchIcon/>
                                        </div>
                                        <InputBase
                                            fullWidth={true}
                                            placeholder="Search…"
                                            classes={{
                                                root: classes.inputRoot,
                                                input: classes.inputInput,
                                            }}
                                            style={{
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}

                                            inputProps={{'aria-label': 'search'}}
                                            onKeyPress={onKeyPress}
                                            onChange={onChange}
                                        />
                                    </div>
                                </div>

                            </Grid>

                            <Grid item xs={2}>
                                {user ? (
                                    <div style={{display: "flex", alignItems: "center", justifyContent: "flex-end"}}>
                                        <Tooltip title="Chats" aria-label="Chats">
                                        <IconButton className={classes.chat}
                                                    onClick={() => {
                                                        history.push("/chat")
                                                    }}
                                        >
                                            <Forum />
                                        </IconButton>
                                        </Tooltip>
                                    <Tooltip title="Profile" aria-label="Profile">
                                        <IconButton onClick={
                                                        handleMenu
                                                    }
                                                    className={classes.profile}
                                        >
                                    <div  className={classes.circle}>
                                            <img src={user.photoURL}
                                                 alt="profile-picture"
                                                 width={profilePictureSize}
                                                 height={profilePictureSize}
                                            />
                                        </div>
                                            <ArrowDropDownIcon />
                                        </IconButton>
                                    </Tooltip>
                                    </div>
                                    )
                                    : (
                                        <Button style={{color: "white"}} onClick={() => {
                                            history.push("/menu")
                                        }}>Sign in</Button>
                                    )}
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorEl}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={open}
                                    onClose={() => {
                                        setAnchorEl(null)
                                    }}
                                >
                                    <MenuItem onClick={() => handleMenuClick("/Profile")}>Profile</MenuItem>
                                    <MenuItem onClick={() => {user ? handleMenuClick("/signout") : handleMenuClick("/menu")}}>{user ? "Sign Out" : "Sign In"}</MenuItem>
                                </Menu>
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>
            </HideOnScroll>
            <Toolbar id="back-to-top-anchor" />

            <BackToTop>
                <Fab color="secondary" size="large" aria-label="scroll back to top">
                    <KeyboardArrowUp />
                </Fab>
            </BackToTop>
        </div>
    )
}

export default Header;