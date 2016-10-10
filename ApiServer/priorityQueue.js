var priorityQueue = (function(){

    var items = [],
        size = 0;

    function PriorityQueue() {

    }

    PriorityQueue.prototype.enqueue = function(item) {
        items.push(item);
        size++;
        let ci = this.size() - 1;
        while(ci > 0) {
            let pi = Math.floor((ci - 1) / 2);
            //greater
            if(compare(items[ci].priority, items[pi].priority) >= 0) {
                break;
            }
            let temp = items[ci];
            items[ci] = items[pi];
            items[pi] = temp;
            ci = pi;
        }
    }

    PriorityQueue.prototype.dequeue = function() {
        let li = this.size() - 1;
        let item = items[0];
        items[0] = items[li];
        items[li] = null;
        --size;
        --li;//last index after removal
        let pi = 0;
        while (true) {
            let lci = (2 * pi) + 1;
            if(lci > li) break;//no children, exit
            let rci = lci + 1;
            if (rci <= li && compare(items[rci].priority, items[lci].priority) < 0) // if there is a rc (ci + 1), and it is smaller than left child, use the rc instead
                lci = rci;
            if (compare(items[pi].priority, items[lci].priority) <= 0) break; // parent is smaller than (or equal to) smallest child so done
            let tmp = items[pi]; 
            items[pi] = items[lci]; 
            items[lci] = tmp; // swap parent and child
            pi = lci;
        }
        return item;
    }

    PriorityQueue.prototype.isPriorityQueue = function() {
        if(this.size() == 0) return true;
        let pi = 0;
        let count = this.size() - 1,
            li = this.size() - 1;
        while(count > 0) {
            let lci = (2 * pi) + 1;
            let rci = (2 * pi) + 2;
            if(lci <= li && compare(items[pi].priority, items[lci].priority) > 0) return false;
            if(rci <= li && compare(items[pi].priority, items[rci].priority) > 0) return false;
            count--;
            pi++;
        }
        return true;
    }

    PriorityQueue.prototype.size = function() {
        return size;
    }

    PriorityQueue.prototype.print = function() {
        items.forEach(function(item){
            if(item != null) {
                console.log(`Item: ${item.val} - Priority: ${item.priority}`);
            }
        });
        console.log("-------------------------------");
    }

    return PriorityQueue;

    function compare(val1, val2) {
        if (val1 < val2) return -1;
        else if (val1 > val2) return 1;
        else return 0;    
    }

}());

module.exports = priorityQueue;