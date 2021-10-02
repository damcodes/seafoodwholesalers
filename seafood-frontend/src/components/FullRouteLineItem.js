import { Table, Icon, Button, Input } from 'semantic-ui-react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Adapter from '../adapters/Adapter'

const FullRouteLineItem = ({ order, setRouteChanged, shipped }) => {

    const [currentOrder, setCurrentOrder] = useState(order)
    const [customer, setCustomer] = useState({})
    const [input, setInput] = useState(false)
    const [stop, setStop] = useState(null)

    useEffect(() => {
        const getUser = async () => {
            let res = await Adapter.fetch("GET", `users/${order.user_id}`);
            let user = await handleResponse(res);
            setCustomer(user);
        }
        getUser();
    }, [order])

    const stringToSlug = (str) => {
        str = str.replace(/^\s+|\s+$/g, ''); // trim
        str = str.toLowerCase();

        // remove accents, swap ñ for n, etc
        var from = "àáãäâèéëêìíïîòóöôùúüûñç·/_,:;";
        var to = "aaaaaeeeeiiiioooouuuunc------";

        for (var i = 0; i < from.length; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            .replace(/-+/g, '-'); // collapse dashes

        return str;
    }

    const handleResponse = async res => {
        let json = await res.json();
        if (!res.ok) {
            const err = Object.assign({}, json, {
                status: res.status,
                statusText: res.statusText
            });
            return Promise.reject(err);
        };
        return json;
    }

    const routeStop = (order) => {
        if (order.stop === 0 && !shipped) return <Button onClick={() => setInput(!input)} size='tiny'>Route</Button>
        if (order.order_status === 'delivered') return order.stop
        return <Button positive onClick={() => setInput(!input)} size='tiny'>{order.stop}</Button>
    }

    const formatTime = (dateTimeStr) => {
        const date = new Date(dateTimeStr)
        const timeStr = date.toLocaleTimeString()
        return timeStr
    }

    const updateStopNumber = async () => {
        if (stop !== '0' && stop !== '') {
            const body = {
                order: {
                    stop: stop
                }
            };
            let res = await Adapter.fetch("PATCH", `orders/${currentOrder.id}`, body);
            let order = await handleResponse(res);
            setInput(!input);
            setCurrentOrder(order);
        }
        setRouteChanged({ changed: true, id: order.id });
    }

    return (!currentOrder ?
        <Table.Row>
            <Table.Cell textAlign='center'>
                {input ?
                    <>
                        <Input onChange={e => setStop(e.target.value)} type='number' />
                        <Button positive
                            onClick={() => updateStopNumber()
                            }>
                            <Icon name='check' />
                        </Button>
                    </>
                    :
                    routeStop(order)
                }
            </Table.Cell>
            <Table.Cell textAlign='center'><Link to={`/orders/${order.order_number}`}>{order.order_number}</Link></Table.Cell>
            <Table.Cell textAlign='center'><Link to={`/companies/${stringToSlug(customer.company.name)}`}>{customer.company ? customer.company.name : null}</Link></Table.Cell>
            <Table.Cell textAlign='center'>{formatTime(order.created_at)}</Table.Cell>
            <Table.Cell textAlign='center'>{`${order.order_status.slice(0, 1).toUpperCase() + order.order_status.slice(1)} @ ${formatTime(order.updated_at)}`}</Table.Cell>
        </Table.Row>
        :
        <Table.Row>
            <Table.Cell textAlign='center'>
                {input ?
                    <>
                        <Input onChange={e => setStop(e.target.value)} type='number' />
                        <Button positive
                            onClick={() => updateStopNumber()
                            }>
                            <Icon name='check' />
                        </Button>
                    </>
                    :
                    routeStop(currentOrder)
                }
            </Table.Cell>
            <Table.Cell textAlign='center'><Link to={`/orders/${currentOrder.order_number}`}>{currentOrder.order_number}</Link></Table.Cell>
            <Table.Cell textAlign='center'>{customer.company ? customer.company.name : null}</Table.Cell>
            <Table.Cell textAlign='center'>{formatTime(currentOrder.created_at)}</Table.Cell>
            <Table.Cell textAlign='center'>{currentOrder.order_status === 'completed' ? formatTime(currentOrder.updated_at) : currentOrder.order_status.slice(0, 1).toUpperCase() + currentOrder.order_status.slice(1)}</Table.Cell>
        </Table.Row>
    )

}

export default FullRouteLineItem