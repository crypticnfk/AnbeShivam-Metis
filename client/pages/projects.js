import styles from '../styles/Projects.module.css';
import { Context } from '../context/state';
import { create } from 'ipfs-http-client';
import React from 'react';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import { AtomSpinner } from 'react-epic-spinners';
import {
    useState,
    useEffect,
    useContext
} from "react";
import {
    loadWeb3,
    loadBlockchainData,
    getProjects,
    getAccountAddress,
    investFunds,
    withdrawFunds,
    getGODSBalance
} from '../utils/web3-utils';
import ProjectModal from '../components/modal';

const client = create('https://ipfs.infura.io:5001/api/v0');

function Projects() {
    const [web3, setweb3] = useContext(Context);
    const [connected, setConnected] = useState(false);
    const [loading, setLoading] = useState(false);
    const [account, setAccount] = useState("Not Connected");
    const [projects, setProjects] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [chosenProject, chooseProject] = useState(null);

    useEffect(async () => {
        if (web3) {
            setLoading(true);
            await loadWeb3();
            const isConnected = await loadBlockchainData();
            setConnected(isConnected);
            if(isConnected) {
                const account = await getAccountAddress();
                setAccount(account);
                const projects = await getProjects();
                setProjects(projects);
            }
            setLoading(false);
        }
    }, [web3, account]);

    const getProject = async (event) => {
        event.preventDefault();

        setLoading(true);
        chooseProject(projects[event.target.value]);
        setModalShow(true);
        setLoading(false);
    }

    const withdraw = async (event) => {
        event.preventDefault();

        setLoading(true);
        await withdrawFunds(event.target.value);
        setLoading(false);
    }

    const investInProject = async (amount) => {
        const GODSbalance = await getGODSBalance();
        let metadata;
        if (GODSbalance > 100) {
            metadata = {
                name: "AnbeShivam Gold NFT",
                description: "Certified AnbeShivam Investor - Gold Tier",
                image: "https://bafybeigkcsmj26lsn7vh4dwfadzz4wotswpfmno6ng3x7gury7ohsb7azq.ipfs.infura-ipfs.io/"
            }
        } else if (GODSbalance > 10) {
            metadata = {
                name: "AnbeShivam Silver NFT",
                description: "Certified AnbeShivam Investor - Silver Tier",
                image: "https://bafybeihkihzrr5zkwbpoyrs3miw32pvlo4pemvsyfoilbmdt5ionstidpi.ipfs.infura-ipfs.io/"
            }
        } else {
            metadata = {
                name: "AnbeShivam Bronze NFT",
                description: "Certified AnbeShivam Investor - Bronze Tier",
                image: "https://bafybeicbgjxx2ncfhe5u275u4s7hhfs6xiw775hgscbmboryg6qs7f6biq.ipfs.infura-ipfs.io/"
            }
        }
        const metadataString = JSON.stringify(metadata);
        setLoading(true);
        let uri;
        try {
            const added = await client.add(metadataString);
            uri = `https://ipfs.infura.io/ipfs/${added.path}`;
        } catch (error) {
            console.log('Error uploading file: ', error);
        }
        await investFunds(chosenProject.id, uri, amount);
        setLoading(false);
        window.alert("Successfully funded Project " + chosenProject.name);
    }

    if (connected) {
        if(loading) {
            return (
                <div className="spinner" >
                    <AtomSpinner color="lightblue" size="150" />
                </div>
            );
        } else {
        return (
            <>
                <div className="col-md-6 offset-md-3 mt-5">
                    <br /><br />
                    {projects.length == 0 &&
                        <div className="st-heading">
                        <h1 className={styles.heading}>No Projects to display</h1>
                        </div>
                    }
                    {projects.length > 0 &&
                        <div>
                            <div className="st-heading">
                                <h1 className>Projects</h1>
                                <br/>
                            </div>
                            {projects.map((project, key) => (
                                <div>
                                    <center>
                                    <Card style={{ width: '30rem' }}>
                                        <Card.Header>
                                            <h3>{project.name}</h3>
                                            <h4>Votes Received: {project.votes.toString()}</h4>
                                        </Card.Header>
                                        <Card.Body>
                                            <Button id={key} value={key} variant="primary" onClick={getProject}>View Project Pitch</Button>
                                            <br/><br/>
                                            {project.creator.toUpperCase() === account.toUpperCase() &&
                                            <Button id={key} value={key} variant="primary" onClick={withdraw}>Withdraw Projects Funds</Button>
                                            }
                                        </Card.Body>
                                    </Card>
                                    </center>
                                    <br/>
                                </div>                              
                            ))}
                            <ProjectModal
                                show={modalShow}
                                project={chosenProject}
                                investInProject={(amount) => investInProject(amount)}
                                onHide={() => setModalShow(false)}
                            />
                        </div>
                    }
                </div>
            </>
        );
        }
    } else {
        return (
            <div className="st-heading">
                <h1>Not Connected</h1>
            </div>
        );
    }
}

export default Projects;
