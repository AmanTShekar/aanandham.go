import {
    TbBeach, TbMountain, TbPool, TbUfo, TbSnowflake, TbTent,
    TbBuildingCastle, TbCamper, TbSailboat, TbPalette, TbTicket
} from 'react-icons/tb';
import { GiBarn, GiForestCamp, GiCactus, GiCaveEntrance, GiIsland, GiPartyPopper, GiKnifeFork } from 'react-icons/gi';
import { MdOutlineVilla, MdOutlineSpa, MdOutlineSportsTennis, MdOutlineNaturePeople } from 'react-icons/md';

export const stayCategories = [
    { label: 'Beach', icon: TbBeach },
    { label: 'Windmills', icon: GiBarn },
    { label: 'Modern', icon: MdOutlineVilla },
    { label: 'Countryside', icon: TbMountain },
    { label: 'Pools', icon: TbPool },
    { label: 'Islands', icon: GiIsland },
    { label: 'Lake', icon: TbSailboat },
    { label: 'Skiing', icon: TbSnowflake },
    { label: 'Castles', icon: TbBuildingCastle },
    { label: 'Caves', icon: GiCaveEntrance },
    { label: 'Camping', icon: TbTent },
    { label: 'Arctic', icon: TbSnowflake },
    { label: 'Desert', icon: GiCactus },
    { label: 'Camper vans', icon: TbCamper },
    { label: 'OMG!', icon: TbUfo },
];

export const experienceCategories = [
    { label: 'Art & Culture', icon: TbPalette },
    { label: 'Entertainment', icon: TbTicket },
    { label: 'Food & Drink', icon: GiKnifeFork },
    { label: 'Sports', icon: MdOutlineSportsTennis },
    { label: 'Tours', icon: TbCamper },
    { label: 'Sightseeing', icon: TbBuildingCastle },
    { label: 'Wellness', icon: MdOutlineSpa },
    { label: 'Nature & Outdoors', icon: MdOutlineNaturePeople },
];
