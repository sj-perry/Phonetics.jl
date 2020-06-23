var documenterSearchIndex = {"docs":
[{"location":"lc/#Lexical-characteristics-1","page":"Lexical characteristics","title":"Lexical characteristics","text":"","category":"section"},{"location":"lc/#Phonological-neighborhood-density-1","page":"Lexical characteristics","title":"Phonological neighborhood density","text":"","category":"section"},{"location":"lc/#","page":"Lexical characteristics","title":"Lexical characteristics","text":"Phonological neighborhood density, as described by Luce & Pisoni (1998), as a concept is a set of words that sound similar to each other. Vitevitch & Luce (2016) explain that it's common to operationalize this concept as the number of words that have a Levenshtein distance (minimal number of segment additions, subtractions, or substitutions to transform one word or string into another) of exactly 1 from the word in question.","category":"page"},{"location":"lc/#","page":"Lexical characteristics","title":"Lexical characteristics","text":"The pnd function allows a user to calculate this value for a list of words based on a given corpus. The following example shows how to use the pnd function. Note that the entries in the sample corpus are given using the Arpabet transcription scheme.","category":"page"},{"location":"lc/#","page":"Lexical characteristics","title":"Lexical characteristics","text":"using Phonetics\r\nsample_corpus = [\r\n[\"K\", \"AE1\", \"T\"], # cat\r\n[\"K\", \"AA1\", \"B\"], # cob\r\n[\"B\", \"AE1\", \"T\"], # bat\r\n[\"T\", \"AE1\", \"T\", \"S\"], # tats\r\n[\"M\", \"AA1\", \"R\", \"K\"], # mark\r\n[\"K\", \"AE1\", \"B\"], # cab\r\n]\r\npnd(sample_corpus, [[\"K\", \"AE1\", \"T\"]])","category":"page"},{"location":"lc/#","page":"Lexical characteristics","title":"Lexical characteristics","text":"As we can see, [K AA1 T] cat has 2 phonological neighbors in the given corpus, so it has a phonological neighborhood density of 2. The data is returned in a DataFrame so that processing that uses tabular data can be performed.","category":"page"},{"location":"lc/#","page":"Lexical characteristics","title":"Lexical characteristics","text":"A more likely scenario is calculating the phonological neighborhood density for each item in the CMU Pronouncing dictionary. For the purposes of this example, I'll assume you have already downloaded the CMU Pronouncing Dictionary. There is a bit of extra information at the top of the document that needs to be deleted, so make sure the first line in the document is the entry for \"!EXCLAMATION-POINT\".","category":"page"},{"location":"lc/#","page":"Lexical characteristics","title":"Lexical characteristics","text":"Now, the first thing we need to do is read the file into Julia and process it into a usable state. Because we're interested in the phonological transcriptions here, we'll strip away the orthographic representation.","category":"page"},{"location":"lc/#","page":"Lexical characteristics","title":"Lexical characteristics","text":"using Phonetics\r\ncorpus = Vector()\r\nopen(\"cmudict-0.7b\") do f\r\n  lines = readlines(f)\r\n  for line in lines\r\n    phonological_transcription = split(split(line, \"  \")[2])\r\n    push!(corpus, phonological_transcription)\r\n  end\r\nend","category":"page"},{"location":"lc/#","page":"Lexical characteristics","title":"Lexical characteristics","text":"Notice that we called split twice. The first time was to split the orthographic representation from the phonological one, and they're separated by two spaces. We wanted the phonological transcription, so we took the second element from the Array that results from that call to split. The second call to split was to split the phonological representation into another Array. This is necessary because the CMU Pronouncing Dictionary uses a modified version of the Aprabet transcription scheme and doesn't always use only 1 character to represent a particular phoneme. So we can't just process each individual item in a string as we might be able to do for a 1 character to 1 phoneme mapping like the International Phonetic Alphabet. Representing each phoneme as one element in an Array allows us to process the data correctly.","category":"page"},{"location":"lc/#","page":"Lexical characteristics","title":"Lexical characteristics","text":"Now that we have the corpus set up, all we need to do is call the pnd function.","category":"page"},{"location":"lc/#","page":"Lexical characteristics","title":"Lexical characteristics","text":"neighborhood_density = pnd(corpus, corpus)","category":"page"},{"location":"lc/#","page":"Lexical characteristics","title":"Lexical characteristics","text":"The output from pnd is a DataFrame where the queries are in the first column and the associated neighborhood densities are in the second column. This DataFrame can then be used in subsequent statistical analyses or saved to a file for use in other programming language or software like R.","category":"page"},{"location":"lc/#Implementation-note-1","page":"Lexical characteristics","title":"Implementation note","text":"","category":"section"},{"location":"lc/#","page":"Lexical characteristics","title":"Lexical characteristics","text":"The intuitive way of coding phonological neighborhood density involves comparing every item in the corpus against every other item in the corpus and counting how many neighbors each item has. However, this is computationally inefficient, as there are approximately n^2 comparisons that must be performed. In this package, this process is sped up by using a spatial data structure called a vantage-point tree. This data structure is a binarily branching tree where all the items on the left of a node are less than a particular distance away from the item in the node, and all those on the right are greater than or equal to that particular distance.","category":"page"},{"location":"lc/#","page":"Lexical characteristics","title":"Lexical characteristics","text":"Because of the way that the data is organized in a vantage-point tree, fewer comparisons need to be made. While descending the tree, it can be determined whether any of the points in a branch from a particular node should be searched or not, limiting the number of branches that need to be traversed. In practical terms, this means that the Levenshtein distance is calculated fewer times for each item, and the phonological neighborhood density should be calculated faster for a data set than from using the traditional approach that compares each item to all the other ones in the corpus. At the time of writing this document, I am not aware of any phonological neighborhood density calculator/script that offers this kind of speedup.","category":"page"},{"location":"lc/#Phonotactic-probability-1","page":"Lexical characteristics","title":"Phonotactic probability","text":"","category":"section"},{"location":"lc/#","page":"Lexical characteristics","title":"Lexical characteristics","text":"The phonotactic probability is likelihood of observing a sequence in a given language. It's typically calculated as either the co-occurrence probability of a series of phones or diphones, or the cumulative transitional probability of moving from one portion of the sequence to the next.","category":"page"},{"location":"lc/#","page":"Lexical characteristics","title":"Lexical characteristics","text":"This package currently provides the co-occurrence method of calculating the phonotactic probability, and this can be done taking the position of a phone or diphone into account, or just looking at the co-occurrence probability. By means of example:","category":"page"},{"location":"lc/#","page":"Lexical characteristics","title":"Lexical characteristics","text":"using Phonetics # hide\r\nsample_corpus = [\r\n[\"K\", \"AE1\", \"T\"], # cat\r\n[\"K\", \"AA1\", \"B\"], # cob\r\n[\"B\", \"AE1\", \"T\"], # bat\r\n[\"T\", \"AE1\", \"T\", \"S\"], # tats\r\n[\"M\", \"AA1\", \"R\", \"K\"], # mark\r\n[\"K\", \"AE1\", \"B\"], # cab\r\n]\r\nfreq = [1,1,1,1,1,1]\r\np = prod([4,4,4] / 20)\r\nphnprb(sample_corpus, freq, [[\"K\", \"AE1\", \"T\"]])","category":"page"},{"location":"lc/#","page":"Lexical characteristics","title":"Lexical characteristics","text":"In this example, each phone has 4 observations in the corpus, and the likelihood of observing each of those phones is 4/20. Because there are 3, the phonotactic probability of this sequence is frac420^3, which is 0.008. Floating point errors sometimes occur in the arithmetic in programming, but this is unavoidable.","category":"page"},{"location":"lc/#","page":"Lexical characteristics","title":"Lexical characteristics","text":"using Phonetics # hide\r\nsample_corpus = [\r\n[\"K\", \"AE1\", \"T\"], # cat\r\n[\"K\", \"AA1\", \"B\"], # cob\r\n[\"B\", \"AE1\", \"T\"], # bat\r\n[\"T\", \"AE1\", \"T\", \"S\"], # tats\r\n[\"M\", \"AA1\", \"R\", \"K\"], # mark\r\n[\"K\", \"AE1\", \"B\"], # cab\r\n]\r\nfreq = [1,1,1,1,1,1]\r\np = prod([3,2,3,2]/26)\r\nphnprb(sample_corpus, freq, [[\"K\", \"AE1\", \"T\"]]; nchar=2)","category":"page"},{"location":"lc/#","page":"Lexical characteristics","title":"Lexical characteristics","text":"In this example here, the input is padded so that the beginning and ending of the word are taken into account when calculating the phonotactic probability. There are 3 counts of [. K] (where [.] is the word boundary symbol), 2 counts of [K AE1], 3 counts of [AE1 T], and 2 counts of [T .]. There are 26 total diphones observed in the corpus, so the phonotactic probability is calculated as","category":"page"},{"location":"lc/#","page":"Lexical characteristics","title":"Lexical characteristics","text":"frac326 times frac226 times frac326 times frac226 ","category":"page"},{"location":"lc/#Uniqueness-point-1","page":"Lexical characteristics","title":"Uniqueness point","text":"","category":"section"},{"location":"lc/#","page":"Lexical characteristics","title":"Lexical characteristics","text":"The uniqueness point of a word is defined as the segment in a sequence after which that sequence can be uniquely identified. In cohort models of speech perception, it is after this point that a listener will recognize a word while it's being spoken. As an example:","category":"page"},{"location":"lc/#","page":"Lexical characteristics","title":"Lexical characteristics","text":"using Phonetics\r\nsample_corpus = [\r\n[\"K\", \"AE1\", \"T\"], # cat\r\n[\"K\", \"AA1\", \"B\"], # cob\r\n[\"B\", \"AE1\", \"T\"], # bat\r\n[\"T\", \"AE1\", \"T\", \"S\"], # tats\r\n[\"M\", \"AA1\", \"R\", \"K\"], # mark\r\n[\"K\", \"AE1\", \"B\"], # cab\r\n]\r\nupt(sample_corpus, [[\"K\", \"AA1\", \"T\"]]; inCorpus=true)","category":"page"},{"location":"lc/#","page":"Lexical characteristics","title":"Lexical characteristics","text":"Here, [K AA1 B] cob has a uniqueness point of 2. Looking at the corpus, we can be sure we're looking at cob after observing the [AA1] because nothing else begins with the sequence [K AA1]. Thus, its uniqueness point is 2.","category":"page"},{"location":"lc/#","page":"Lexical characteristics","title":"Lexical characteristics","text":"using Phonetics\r\nsample_corpus = [\r\n[\"K\", \"AE1\", \"T\"], # cat\r\n[\"K\", \"AA1\", \"B\"], # cob\r\n[\"B\", \"AE1\", \"T\"], # bat\r\n[\"T\", \"AE1\", \"T\", \"S\"], # tats\r\n[\"M\", \"AA1\", \"R\", \"K\"], # mark\r\n[\"K\", \"AE1\", \"B\"], # cab\r\n]\r\nupt(sample_corpus, [[\"K\", \"AE1\", \"D\"]]; inCorpus=false)","category":"page"},{"location":"lc/#","page":"Lexical characteristics","title":"Lexical characteristics","text":"As is evident, given this sample corpus, [K AE1 D] cad is unique after the 3rd segment. That is, it can be uniquely identified after hearing the [D].","category":"page"},{"location":"lc/#","page":"Lexical characteristics","title":"Lexical characteristics","text":"using Phonetics\r\nsample_corpus = [\r\n[\"K\", \"AE1\", \"T\"], # cat\r\n[\"K\", \"AA1\", \"B\"], # cob\r\n[\"B\", \"AE1\", \"T\"], # bat\r\n[\"T\", \"AE1\", \"T\", \"S\"], # tats\r\n[\"M\", \"AA1\", \"R\", \"K\"], # mark\r\n[\"K\", \"AE1\", \"B\"], # cab\r\n]\r\nupt(sample_corpus, [[\"T\", \"AE1\", \"T\"]]; inCorpus=false)","category":"page"},{"location":"lc/#","page":"Lexical characteristics","title":"Lexical characteristics","text":"Here, [T AE1 T] tat cannot be uniquely identified until after the sequence is complete, so its uniqueness point is one longer than its length.","category":"page"},{"location":"lc/#Function-documentation-1","page":"Lexical characteristics","title":"Function documentation","text":"","category":"section"},{"location":"lc/#","page":"Lexical characteristics","title":"Lexical characteristics","text":"pnd(corpus::Array, queries::Array; [progress=true])","category":"page"},{"location":"lc/#Phonetics.pnd-Tuple{Array,Array}","page":"Lexical characteristics","title":"Phonetics.pnd","text":"pnd(corpus::Array, queries::Array; [progress=true])\n\nCalculate the phonological neighborhood density (pnd) for each item in queries based on the items in corpus. This function uses a vantage point tree data structure to speed up the search for neighbors by pruning the search space. This function should work regardless of whether the items in queries are in corpus or not.\n\nParameters\n\ncorpus The corpus to be queried for phonological neighbors\nqueries The items to query phonological neighbors for in corpus\nprogress Whether to display a progress meter or not\n\nReturns\n\nA DataFrame with the queries in the first column and the phonological   neighborhood density in the second\n\n\n\n\n\n","category":"method"},{"location":"lc/#","page":"Lexical characteristics","title":"Lexical characteristics","text":"phnprb(corpus::Array, frequencies::Array{Int64}, queries::Array;\r\n    [positional=false, nchar=1, pad=true])","category":"page"},{"location":"lc/#Phonetics.phnprb-Tuple{Array,Array{Int64,N} where N,Array}","page":"Lexical characteristics","title":"Phonetics.phnprb","text":"phnprb(corpus::Array, frequencies::Array, queries::Array; positional=false,\n    nchar=1, pad=true)\n\nCalculates the phonotactic probability for each item in a list of queries based on a corpus\n\nArguments\n\ncorpus The corpus on which to base the probability calculations\nfrequencies The frequencies associated with each element in corpus\nqueries The items for which the probability should be calculated\n\nKeyword arguments\n\npositional  Whether to consider where in the query a given phone appears\n\n(e.g., should \"K\" as the first sound be considered a different category than \"K\"     as the second sound?)\n\nnchar The number of characters for each n-gram that will be examined   (e.g., 2 for diphones)\npad Whether to add padding to each query or not\n\nReturns\n\nA DataFrame with the queries in the first column and the probability values     in the second\n\n\n\n\n\n","category":"method"},{"location":"lc/#","page":"Lexical characteristics","title":"Lexical characteristics","text":"```@docs upt(corpus::Array, queries::Array; [inCorpus=true])","category":"page"},{"location":"lc/#References-1","page":"Lexical characteristics","title":"References","text":"","category":"section"},{"location":"lc/#","page":"Lexical characteristics","title":"Lexical characteristics","text":"Luce, P. A., & Pisoni, D. B. (1998). Recognizing spoken words: The neighborhood activation model. Ear and hearing, 19(1), 1.","category":"page"},{"location":"lc/#","page":"Lexical characteristics","title":"Lexical characteristics","text":"Vitevitch, M. S., & Luce, P. A. (2016). Phonological neighborhood effects in spoken word perception and production. Annual Review of Linguistics, 2, 75-94.","category":"page"},{"location":"vowelplot/#Vowel-plotting-1","page":"Vowel plotting","title":"Vowel plotting","text":"","category":"section"},{"location":"vowelplot/#","page":"Vowel plotting","title":"Vowel plotting","text":"The function provided for plotting vowels diplays offers a variety of visualization techniques for displaying a two-dimensional plot for vowel tokens. Traditionally, it is F1 and F2 that are plotted, but any two pairs of data can be plotted, such as F2 and F3, F2-F1 and F3, etc.","category":"page"},{"location":"vowelplot/#Examples-1","page":"Vowel plotting","title":"Examples","text":"","category":"section"},{"location":"vowelplot/#","page":"Vowel plotting","title":"Vowel plotting","text":"using Phonetics # hide\r\ndata = generateFormants(30, gender=[:w], seed=56) # hide\r\nvowelPlot(data.f1, data.f2, data.vowel, xlab=\"F1 (Hz)\", ylab=\"F2 (Hz)\")","category":"page"},{"location":"vowelplot/#","page":"Vowel plotting","title":"Vowel plotting","text":"This is a traditional vowel plot, with F1 on the x-axis in increasing order and F2 on the y-axis in increasing order. Note that simulated data were generated using the generateFormants function. Specifying a seed value makes the results reproducible. (Keep in mind that if you are generating values for different experiments, reports, studies, etc., the seed value needs to be changed (or left unspecified) so that the same data are not generated every time when they shouldn't be reproducible.)","category":"page"},{"location":"vowelplot/#","page":"Vowel plotting","title":"Vowel plotting","text":"For those inclined to use the alternate axes configuration with F2 decreasing on the x-axis and F1 decreasing on the y-axis, the xflip and yflip arguments that the Plots.jl package makes use of can be passed in to force the axes to be decreasing, the F2 values can be passed into the first argument slot, and the F1 values can be passed into the second argument slot.","category":"page"},{"location":"vowelplot/#","page":"Vowel plotting","title":"Vowel plotting","text":"using Phonetics # hide\r\ndata = generateFormants(30, gender=[:w], seed=56) # hide\r\nvowelPlot(data.f2, data.f1, data.vowel,\r\n  xflip=true, yflip=true, xlab=\"F2 (Hz)\", ylab=\"F1 (Hz)\")","category":"page"},{"location":"vowelplot/#","page":"Vowel plotting","title":"Vowel plotting","text":"I don't personally prefer to look at vowel plots in this manner because I think it unfairly privileges articulatory characteristics of vowel production when examining acoustic characteristics, so subsequent examples will not be presented using this axis configuration. However, the same principle applies to switching the axes around.","category":"page"},{"location":"vowelplot/#","page":"Vowel plotting","title":"Vowel plotting","text":"The vowelPlot function also allows for ellipses to be plotted around the values with the ell and ellPercent arguments. The ell argument takes a true or false value. The ellPercent argument should be a value between greater than 0 and less than 1, and it represents the approximate percentage of the data the should be contained within the ellipse. This is in contrast to some packages available in R that allow you to specify the number of standard deviations that the ellipse should be stretched to. The reason is that the traditional cutoff values of 1 standard deviation for 67%, 2 standard deviations for 95%, etc. for univariate Gaussian distributions does not carry over to multiple dimensions. While, the appropriate amount of stretching of the ellipse can be determined from the percentage of data to contain (Wang et al., 2015).","category":"page"},{"location":"vowelplot/#","page":"Vowel plotting","title":"Vowel plotting","text":"using Phonetics # hide\r\ndata = generateFormants(30, gender=[:w], seed=56) # hide\r\nvowelPlot(data.f1, data.f2, data.vowel, ell=true, ellPercent=0.67,\r\n  xlab=\"F1 (Hz)\", ylab=\"F2 (Hz)\")","category":"page"},{"location":"vowelplot/#","page":"Vowel plotting","title":"Vowel plotting","text":"Each of the data clouds in the scatter have an ellipse overlaid on them so as to contain 67% of the data. The ellipse calculation process is given in Friendly et al. (2013).","category":"page"},{"location":"vowelplot/#","page":"Vowel plotting","title":"Vowel plotting","text":"One final feature to point out is that the vowelplot function can also plot just the mean value of each vowel category with the meansOnly argument. Additionally, a label can be added to each category with the addLabels argument, which bases the labels on the category given in the cats argument.","category":"page"},{"location":"vowelplot/#","page":"Vowel plotting","title":"Vowel plotting","text":"using Phonetics # hide\r\ndata = generateFormants(30, gender=[:w], seed=56) # hide\r\nvowelPlot(data.f1, data.f2, data.vowel, ell=true,\r\n  meansOnly=true, addLabels=true, xlab=\"F1 (Hz)\", ylab=\"F2 (Hz)\")","category":"page"},{"location":"vowelplot/#","page":"Vowel plotting","title":"Vowel plotting","text":"The labels are offset from the mean value a bit so as to not cover up the marker showing where the mean value is.","category":"page"},{"location":"vowelplot/#Function-documentation-1","page":"Vowel plotting","title":"Function documentation","text":"","category":"section"},{"location":"vowelplot/#","page":"Vowel plotting","title":"Vowel plotting","text":"vowelPlot(f1, f2, cats; [meansOnly=false, addLabels=true, ell=false,\r\n  ellPercent=0.67, nEllPts=500, markersize=1, linewidth=2, kw...])","category":"page"},{"location":"vowelplot/#Phonetics.vowelPlot-Tuple{Any,Any,Any}","page":"Vowel plotting","title":"Phonetics.vowelPlot","text":"vowelPlot(f1, f2, cats; [meansOnly=false, addLabels=true, ell=false, ellPercent=0.67, nEllPts=500, markersize=1, linewidth=2, kw...])\n\nCreate an F1-by-F2 vowel plot. The f1 values are displayed along the x-axis, and the f2 values are displayed along the y-axis, with each unique vowel class in cats being represented with a new color. The series labels in the legend will take on the unique values contained in cats. The alternate display whereby reversed F2 is on the x-axis and reversed F1 is on the y-axis can be created by passing the F2 values in for the f1 argument and F1 values in for the f2 argument, and then using the :flip magic argument provided by the Plots package.\n\nIf meansOnly is set to true, only the mean values for each vowel category are plotted. Using ell=true will plot a data ellipse that approximately encompases the percentage of data specified by ellPercent. The ellipse is represented by a number of points specified with nEllPts. Other arguments to plot are passed in through the splatted kw argument. Setting the addLabels argument to true will add the text label of the vowel category above and to the right of the mean.\n\nArgs\n\nf1 The F1 values, or otherwise the values to plot on the x-axis\nf2 The F2 values, or otherwise the values to plot on the y-axis\ncats The vowel categories associated with each F1, F2 pair\nmeansOnly (keyword) Plot only mean value for each category\naddLabels (keyword) Add labels for each category to the plot near the mean\nell (keyword) Whether to add data ellipses to the plot\nellPercent (keyword) How much of the data distribution the ellipse should cover (approximately)\nnEllPts (keyword) How many points should be used when plotting the ellipse\nmarkersize (keyword) How large the markers should be; passed directly to plot\nlinewidth (keyword) How wide the line for the llipses should be; passed directly to plot\n\n\n\n\n\n","category":"method"},{"location":"vowelplot/#","page":"Vowel plotting","title":"Vowel plotting","text":"ellipsePts(f1, f2; percent=0.95, nPoints=500)","category":"page"},{"location":"vowelplot/#Phonetics.ellipsePts-Tuple{Any,Any}","page":"Vowel plotting","title":"Phonetics.ellipsePts","text":"ellipsePts(f1, f2; percent=0.95, nPoints=500)\n\nCalculates nPoints points of the perimeter of a data ellipse for f1 and f2 with approximately the percent of the data spcified by percent contained within the ellipse. Points are returned in counter-clockwise order as the polar angle of rotation moves from 0 to 2π.\n\nSee Friendly, Monette, and Fox (2013, Elliptical insights: Understanding statistical methods through elliptical geometry, Statistical science 28(1), 1-39) for more information on the calculation process.\n\nArgs\n\nf1 The F1 values or otherwise x-axis values\nf2 The F2 values or otherwise y-axis values\npercent (keyword) Percent of the data distribution the ellipse should approximately cover\nnPoints (keyword) How many points to use when drawing the ellipse\n\n\n\n\n\n","category":"method"},{"location":"vowelplot/#References-1","page":"Vowel plotting","title":"References","text":"","category":"section"},{"location":"vowelplot/#","page":"Vowel plotting","title":"Vowel plotting","text":"Friendly, M., Monette, G., & Fox, J. (2013). Elliptical insights: understanding statistical methods through elliptical geometry. Statistical Science, 28(1), 1-39.","category":"page"},{"location":"vowelplot/#","page":"Vowel plotting","title":"Vowel plotting","text":"Wang, B., Shi, W., & Miao, Z. (2015). Confidence analysis of standard deviational ellipse and its extension into higher dimensional Euclidean space. PLOS ONE, 10(3), e0118537. https://doi.org/10.1371/journal.pone.0118537","category":"page"},{"location":"#Home-1","page":"Home","title":"Home","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"This is a Julia package that provides a collection of functions to analyze phonetic data.","category":"page"},{"location":"textvptree/#Text-VP-Tree-1","page":"Text VP Tree","title":"Text VP Tree","text":"","category":"section"},{"location":"textvptree/#","page":"Text VP Tree","title":"Text VP Tree","text":"A vantage-point tree is a data structure that takes advantage of the spatial distribution of data and lets allows for faster searching through the data by lowering the amount of comparisons that need to be made. Consider the traditional example of phonological neighborhood density calculation. The code would be written to compare each item to all the other items. For n items, there would be n-1 comparisons. So, to calculate the phonological neighborhood density for each item in a given corpus, there would need to be n times (n-1) =  n^2-n comparisons. This is a lot of comparisons!","category":"page"},{"location":"textvptree/#","page":"Text VP Tree","title":"Text VP Tree","text":"With a vantage-point tree, however, we might get an average of only needing log_2(n) comparisons per query because of the way the data are organized. This means we would only need n times log_2(n) comparisons in total, which can be substantially lower than n^2-n for larger corpora.","category":"page"},{"location":"textvptree/#","page":"Text VP Tree","title":"Text VP Tree","text":"This impelentation is based on the description by Samet (2006).","category":"page"},{"location":"textvptree/#Function-documentation-1","page":"Text VP Tree","title":"Function documentation","text":"","category":"section"},{"location":"textvptree/#","page":"Text VP Tree","title":"Text VP Tree","text":"TextVPTree(items::Array, d::Function)","category":"page"},{"location":"textvptree/#Phonetics.TextVPTree-Tuple{Array,Function}","page":"Text VP Tree","title":"Phonetics.TextVPTree","text":"TextVPTree(items::Array, d::Function)\n\nOuter constructor for a TextVPTree. Takes in an array of items items and a distance function d and proceeds to build a vantage-point tree from them.\n\n\n\n\n\n","category":"method"},{"location":"textvptree/#","page":"Text VP Tree","title":"Text VP Tree","text":"radiusSearch(tree::TextVPTree, query, epsilon)","category":"page"},{"location":"textvptree/#Phonetics.radiusSearch-Tuple{TextVPTree,Any,Any}","page":"Text VP Tree","title":"Phonetics.radiusSearch","text":"radiusSearch(tree::TextVPTree, query, epsilon)\n\nPerforms a search for all items in a VP tree tree that are within a radius epsilon from a query query.\n\nReturns\n\nA Vector of items that are within the given radius epsilon\n\n\n\n\n\n","category":"method"},{"location":"textvptree/#","page":"Text VP Tree","title":"Text VP Tree","text":"nneighbors(tree::TextVPTree, query, n)","category":"page"},{"location":"textvptree/#Phonetics.nneighbors-Tuple{TextVPTree,Any,Any}","page":"Text VP Tree","title":"Phonetics.nneighbors","text":"nneighbors(tree::TextVPTree, query, n)\n\nFind the n nearest neighbors in a VP tree tree to a given query query.\n\nReturns\n\nA PriorityQueue of items where the keys are the items themselves and the values are the distances from the items to query; the PriorityQueue is defined such that small values have higher priorities than large ones\n\n\n\n\n\n","category":"method"},{"location":"textvptree/#References-1","page":"Text VP Tree","title":"References","text":"","category":"section"},{"location":"textvptree/#","page":"Text VP Tree","title":"Text VP Tree","text":"Samet, H. (2006). Foundations of multidimensional and metric data structures. San Francisco, California: Morgan Kaufmann.","category":"page"}]
}
